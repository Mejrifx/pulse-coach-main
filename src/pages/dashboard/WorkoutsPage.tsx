import { Dumbbell } from 'lucide-react';
import { WorkoutTracker } from '@/components/workout/WorkoutTracker';

export default function WorkoutsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-400/90">
            <Dumbbell className="h-5 w-5" aria-hidden />
            <span className="text-xs font-semibold uppercase tracking-wider">Training</span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold text-stone-50">Workout log</h1>
          <p className="mt-2 max-w-2xl text-stone-400">
            Set up your own training days and exercises, then track weight and reps per set. Compare
            each set to your previous session (“Last”).
          </p>
        </div>
      </div>

      <WorkoutTracker />
    </div>
  );
}

