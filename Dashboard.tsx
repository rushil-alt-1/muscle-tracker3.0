import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  TrendingUp, 
  Target, 
  Dumbbell, 
  Play, 
  BarChart3,
  Flame,
  Trophy,
  Clock,
  Zap
} from 'lucide-react';
import { CalendarView } from '@/components/CalendarView';
import { ProgressCharts } from '@/components/ProgressCharts';
import { ProgramDetails } from '@/components/ProgramDetails';
import { Edit3 } from 'lucide-react';
import { useWorkoutPlan } from '@/contexts/WorkoutPlanContext';

interface DashboardProps {
  userName: string;
  onStartWorkout: () => void;
  onModifySchedule: () => void;
  onViewPlan: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userName, onStartWorkout, onModifySchedule, onViewPlan }) => {
  const { workoutPlan } = useWorkoutPlan();
  
  // Get today's workout from the actual plan
  const getTodaysWorkout = () => {
    if (!workoutPlan) return null;
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return workoutPlan.days.find(day => day.day === today);
  };

  const todaysWorkout = getTodaysWorkout();

  // Calculate actual stats from workout plan
  const getWorkoutStats = () => {
    if (!workoutPlan) return { totalDays: 0, avgDuration: 0, totalExercises: 0 };
    
    const totalDays = workoutPlan.days.length;
    const avgDuration = Math.round(workoutPlan.days.reduce((sum, day) => sum + day.duration, 0) / totalDays);
    const totalExercises = workoutPlan.days.reduce((sum, day) => sum + day.exercises.length, 0);
    
    return { totalDays, avgDuration, totalExercises };
  };

  const stats = getWorkoutStats();


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-secondary p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Welcome Header */}
        <div className="text-center space-y-4 py-8">
          <div className="flex justify-end mb-4">
            <Button 
              variant="outline" 
              onClick={onModifySchedule}
              className="flex items-center gap-2 mr-2"
            >
              <Edit3 className="w-4 h-4" />
              Modify Schedule
            </Button>
            <Button 
              variant="outline" 
              onClick={onViewPlan}
              className="flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              View Plan
            </Button>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Welcome back, {userName}!
          </h1>
          <p className="text-lg text-muted-foreground">
            Ready to crush your fitness goals today?
          </p>
        </div>

        {/* Today's Workout Card */}
        {todaysWorkout ? (
          <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 backdrop-blur-glass shadow-elevated">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-primary">Today's Workout</span>
                </div>
                <h2 className="text-2xl font-bold">{todaysWorkout.name}</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {todaysWorkout.exercises.length} exercises
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    ~{todaysWorkout.duration} min
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {todaysWorkout.exercises.slice(0, 3).map((exercise, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-lg"
                    >
                      {exercise.name}
                    </span>
                  ))}
                </div>
              </div>
              <Button 
                size="lg" 
                variant="accent" 
                onClick={onStartWorkout}
                className="flex items-center gap-2 min-w-[140px]"
              >
                <Play className="w-5 h-5" />
                Start Workout
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-6 bg-muted/10 border-muted/20 backdrop-blur-glass shadow-elevated text-center">
            <div className="space-y-4">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground" />
              <h2 className="text-xl font-semibold">Rest Day</h2>
              <p className="text-muted-foreground">No workout scheduled for today. Enjoy your rest!</p>
            </div>
          </Card>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Training Days */}
          <Card className="p-6 bg-glass/30 backdrop-blur-glass border-glass-border shadow-glass hover:shadow-elevated transition-all duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-secondary" />
                  <span className="text-sm font-medium">Training Days</span>
                </div>
                <span className="text-2xl font-bold text-secondary">
                  {stats.totalDays}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Days per week</p>
            </div>
          </Card>

          {/* Average Duration */}
          <Card className="p-6 bg-glass/30 backdrop-blur-glass border-glass-border shadow-glass hover:shadow-elevated transition-all duration-300">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium">Avg Duration</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-accent">{stats.avgDuration}</span>
                <span className="text-sm text-muted-foreground">min</span>
              </div>
              <p className="text-xs text-muted-foreground">Per workout</p>
            </div>
          </Card>

          {/* Total Exercises */}
          <Card className="p-6 bg-glass/30 backdrop-blur-glass border-glass-border shadow-glass hover:shadow-elevated transition-all duration-300">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-warning" />
                <span className="text-sm font-medium">Total Exercises</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-warning">{stats.totalExercises}</span>
                <span className="text-sm text-muted-foreground">exercises</span>
              </div>
              <p className="text-xs text-muted-foreground">In your program</p>
            </div>
          </Card>

          {/* Program Duration */}
          <Card className="p-6 bg-glass/30 backdrop-blur-glass border-glass-border shadow-glass hover:shadow-elevated transition-all duration-300">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Program</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-primary">{workoutPlan?.duration || 'N/A'}</span>
              </div>
              <p className="text-xs text-muted-foreground">Duration</p>
            </div>
          </Card>
        </div>

        {/* Recent Progress and PRs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Program Goals */}
          <Card className="p-6 bg-glass/30 backdrop-blur-glass border-glass-border shadow-glass">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-success" />
                <h3 className="text-lg font-semibold">Your Goals</h3>
              </div>
              
              <div className="space-y-3">
                {workoutPlan?.goals.map((goal, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
                    <div>
                      <p className="font-medium capitalize">{goal.replace('-', ' ')}</p>
                      <p className="text-sm text-muted-foreground">Primary focus</p>
                    </div>
                    <div className="text-right">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 bg-glass/30 backdrop-blur-glass border-glass-border shadow-glass">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Actions</h3>
              
              <div className="grid grid-cols-1 gap-3">
                <Button variant="secondary" className="justify-start h-12" onClick={onStartWorkout}>
                  <Play className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">
                      {todaysWorkout ? "Start Today's Workout" : "No Workout Today"}
                    </p>
                    <p className="text-xs opacity-70">
                      {todaysWorkout ? todaysWorkout.name : "Rest day"}
                    </p>
                  </div>
                </Button>
                
                
                <CalendarView workoutPlan={workoutPlan} />
                
                {workoutPlan && <ProgramDetails workoutPlan={workoutPlan} />}
                
                <ProgressCharts />
                
              </div>
            </div>
          </Card>
        </div>

        {/* Motivational Quotes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-6 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20 backdrop-blur-glass text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img 
                src="/lovable-uploads/7efaaa9c-effc-4d82-a2ac-e0998cbe814d.png" 
                alt="Dumbbell" 
                className="w-8 h-8"
              />
              <blockquote className="text-lg font-medium italic text-foreground">
                "The groundwork for all happiness is good health."
              </blockquote>
            </div>
            <p className="text-sm text-muted-foreground">— Leigh Hunt</p>
          </Card>
          
          <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 backdrop-blur-glass text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img 
                src="/lovable-uploads/7efaaa9c-effc-4d82-a2ac-e0998cbe814d.png" 
                alt="Dumbbell" 
                className="w-8 h-8"
              />
              <blockquote className="text-lg font-medium italic text-foreground">
                "Success isn't always about greatness. It's about consistency."
              </blockquote>
            </div>
            <p className="text-sm text-muted-foreground">— Dwayne Johnson</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;