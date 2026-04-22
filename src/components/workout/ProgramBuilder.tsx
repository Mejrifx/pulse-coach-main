import { useCallback, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { DayDef, ExerciseDef, WorkoutProgramDocument } from '@/types/workout';
import {
  createEmptyWorkoutProgram,
  isProgramUsable,
  newDayKey,
  newExerciseId,
} from '@/lib/workoutProgram';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

type ProgramBuilderProps = {
  initial: WorkoutProgramDocument | null;
  onSave: (program: WorkoutProgramDocument) => Promise<{ ok: boolean; error?: string }>;
  onCancel?: () => void;
  /** Show when user may have existing workout logs. */
  showEditWarning: boolean;
  title: string;
  description: string;
};

function clone(p: WorkoutProgramDocument | null): WorkoutProgramDocument {
  if (!p) return createEmptyWorkoutProgram();
  return {
    version: 1,
    days: p.days.map((d) => ({
      ...d,
      exercises: d.exercises.map((ex) => ({ ...ex })),
    })),
  };
}

export function ProgramBuilder({
  initial,
  onSave,
  onCancel,
  showEditWarning,
  title,
  description,
}: ProgramBuilderProps) {
  const [doc, setDoc] = useState<WorkoutProgramDocument>(() => clone(initial));
  const [saving, setSaving] = useState(false);

  const canSubmit = useMemo(() => isProgramUsable(doc), [doc]);

  const addDay = useCallback(() => {
    const key = newDayKey();
    setDoc((d) => ({
      ...d,
      days: [
        ...d.days,
        {
          key,
          label: `Day ${d.days.length + 1}`,
          shortLabel: `D${d.days.length + 1}`,
          exercises: [
            {
              id: newExerciseId(),
              name: '',
              sets: 3,
              repRange: '8–12',
            },
          ],
        },
      ],
    }));
  }, []);

  const removeDay = useCallback((key: string) => {
    setDoc((d) => ({ ...d, days: d.days.filter((x) => x.key !== key) }));
  }, []);

  const updateDay = useCallback((key: string, patch: Partial<Pick<DayDef, 'label' | 'shortLabel'>>) => {
    setDoc((d) => ({
      ...d,
      days: d.days.map((x) => (x.key === key ? { ...x, ...patch } : x)),
    }));
  }, []);

  const addExercise = useCallback((dayKey: string) => {
    setDoc((d) => ({
      ...d,
      days: d.days.map((x) =>
        x.key === dayKey
          ? {
              ...x,
              exercises: [
                ...x.exercises,
                { id: newExerciseId(), name: '', sets: 3, repRange: '8–12' },
              ],
            }
          : x,
      ),
    }));
  }, []);

  const removeExercise = useCallback((dayKey: string, exId: string) => {
    setDoc((d) => ({
      ...d,
      days: d.days.map((x) =>
        x.key === dayKey
          ? { ...x, exercises: x.exercises.filter((e) => e.id !== exId) }
          : x,
      ),
    }));
  }, []);

  const updateExercise = useCallback((dayKey: string, exId: string, patch: Partial<ExerciseDef>) => {
    setDoc((d) => ({
      ...d,
      days: d.days.map((x) =>
        x.key === dayKey
          ? {
              ...x,
              exercises: x.exercises.map((e) => (e.id === exId ? { ...e, ...patch } : e)),
            }
          : x,
      ),
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!canSubmit) {
      toast.error('Add at least one day, each with a name, short label, and one exercise with name, sets, and rep guidance.');
      return;
    }
    setSaving(true);
    const res = await onSave(doc);
    setSaving(false);
    if (res.ok) {
      toast.success('Program saved');
    } else {
      toast.error(res.error ?? 'Could not save');
    }
  }, [canSubmit, onSave, doc]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-stone-100">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-400">{description}</p>
      </div>

      {showEditWarning ? (
        <Alert className="border-amber-500/30 bg-amber-500/5">
          <AlertCircle className="h-4 w-4 text-amber-400" aria-hidden />
          <AlertTitle className="text-amber-200">Editing your program</AlertTitle>
          <AlertDescription className="text-amber-200/80">
            If you remove days or exercises, previous workout numbers for those items will no
            longer line up. Your history is kept, but set logs may be harder to match.
          </AlertDescription>
        </Alert>
      ) : null}

      {doc.days.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-stone-700 bg-neutral-950/50 px-6 py-10 text-center">
          <p className="text-sm text-stone-400">No training days yet.</p>
          <p className="mt-1 text-xs text-stone-500">Add a day, then add exercises and save.</p>
          <Button
            type="button"
            onClick={addDay}
            className="mt-4 cursor-pointer bg-emerald-500 text-white hover:bg-emerald-400"
          >
            <Plus className="mr-2 h-4 w-4" aria-hidden />
            Add first day
          </Button>
        </div>
      ) : (
        <Accordion type="multiple" className="space-y-2" defaultValue={doc.days[0]?.key ? [doc.days[0].key] : []}>
          {doc.days.map((day) => (
            <AccordionItem
              key={day.key}
              value={day.key}
              className="overflow-hidden rounded-2xl border border-stone-800 bg-neutral-900/50"
            >
              <AccordionTrigger className="cursor-pointer px-4 py-3 text-left hover:no-underline hover:bg-stone-800/30">
                <div className="flex min-w-0 flex-1 items-center justify-between gap-2 pr-2">
                  <span className="truncate font-medium text-stone-100">
                    {day.label.trim() || 'Untitled day'}
                  </span>
                  <span className="shrink-0 text-xs text-stone-500">
                    {day.exercises.length} exercise{day.exercises.length === 1 ? '' : 's'}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="border-t border-stone-800/80 px-4 pb-4 pt-0">
                <div className="mt-4 space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label htmlFor={`${day.key}-label`} className="text-stone-400">
                        Day name
                      </Label>
                      <Input
                        id={`${day.key}-label`}
                        value={day.label}
                        onChange={(e) => updateDay(day.key, { label: e.target.value })}
                        placeholder="e.g. Push day"
                        className="mt-1 border-stone-700 bg-neutral-950"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`${day.key}-short`} className="text-stone-400">
                        Short label
                      </Label>
                      <Input
                        id={`${day.key}-short`}
                        value={day.shortLabel}
                        onChange={(e) => updateDay(day.key, { shortLabel: e.target.value })}
                        placeholder="e.g. P"
                        className="mt-1 border-stone-700 bg-neutral-950"
                        maxLength={8}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {day.exercises.map((ex) => (
                      <div
                        key={ex.id}
                        className="rounded-xl border border-stone-800/80 bg-neutral-950/60 p-3"
                      >
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
                            Exercise
                          </p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeExercise(day.key, ex.id)}
                            className="h-8 w-8 shrink-0 cursor-pointer text-stone-500 hover:bg-red-950/30 hover:text-red-300"
                            aria-label="Remove exercise"
                            disabled={day.exercises.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Input
                            value={ex.name}
                            onChange={(e) => updateExercise(day.key, ex.id, { name: e.target.value })}
                            placeholder="Exercise name"
                            className="border-stone-700 bg-neutral-950"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-[11px] text-stone-500">Sets</Label>
                              <Input
                                type="number"
                                min={1}
                                value={ex.sets}
                                onChange={(e) => {
                                  const n = Number.parseInt(e.target.value, 10);
                                  updateExercise(day.key, ex.id, {
                                    sets: Number.isFinite(n) && n >= 1 ? n : 1,
                                  });
                                }}
                                className="mt-0.5 border-stone-700 bg-neutral-950"
                              />
                            </div>
                            <div>
                              <Label className="text-[11px] text-stone-500">Rep / notes</Label>
                              <Input
                                value={ex.repRange}
                                onChange={(e) =>
                                  updateExercise(day.key, ex.id, { repRange: e.target.value })
                                }
                                placeholder="8–12"
                                className="mt-0.5 border-stone-700 bg-neutral-950"
                              />
                            </div>
                          </div>
                          <Textarea
                            value={ex.notes ?? ''}
                            onChange={(e) =>
                              updateExercise(day.key, ex.id, {
                                notes: e.target.value || undefined,
                              })
                            }
                            placeholder="Optional notes"
                            className="min-h-[64px] resize-y border-stone-700 bg-neutral-950 text-sm"
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addExercise(day.key)}
                      className="w-full cursor-pointer border-dashed border-stone-600 bg-transparent text-stone-300 hover:bg-stone-800/50"
                    >
                      <Plus className="mr-2 h-4 w-4" aria-hidden />
                      Add exercise
                    </Button>
                  </div>

                  <div className="flex justify-end border-t border-stone-800/60 pt-3">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeDay(day.key)}
                      className="cursor-pointer text-red-400 hover:bg-red-950/20 hover:text-red-300"
                    >
                      <Trash2 className="mr-2 h-4 w-4" aria-hidden />
                      Remove this day
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {doc.days.length > 0 ? (
        <Button
          type="button"
          variant="outline"
          onClick={addDay}
          className="w-full cursor-pointer border-dashed border-stone-600 text-stone-300 hover:bg-stone-800/50"
        >
          <Plus className="mr-2 h-4 w-4" aria-hidden />
          Add another day
        </Button>
      ) : null}

      <div
        className={cn(
          'sticky bottom-0 z-10 flex flex-col gap-3 border-t border-stone-800 bg-neutral-950/95 py-4 backdrop-blur sm:flex-row sm:justify-end',
        )}
      >
        {onCancel ? (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            className="cursor-pointer text-stone-400 hover:text-stone-200"
          >
            Cancel
          </Button>
        ) : null}
        <Button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={saving}
          className="cursor-pointer bg-emerald-500 text-white hover:bg-emerald-400 disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save program'}
        </Button>
      </div>
    </div>
  );
}
