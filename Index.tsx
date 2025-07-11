import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import OnboardingForm from '@/components/OnboardingForm';
import Dashboard from '@/components/Dashboard';
import WorkoutSession from '@/components/WorkoutSession';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { ScheduleApproval } from '@/components/ScheduleApproval';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import { RexChatbot } from '@/components/RexChatbot';
import { QuoteTicker } from '@/components/QuoteTicker';
import { googleAIService, WorkoutPlan } from '@/services/GoogleAIService';
import { ModifySchedule } from '@/components/ModifySchedule';
import { ViewPlan } from '@/components/ViewPlan';
import { useWorkoutPlan } from '@/contexts/WorkoutPlanContext';
import { Play, Target, BarChart3, Sparkles, Dumbbell, Zap } from 'lucide-react';
import heroImage from '@/assets/hero-fitness.jpg';
import { useToast } from '@/hooks/use-toast';

type AppState = 'landing' | 'onboarding' | 'dashboard' | 'workout' | 'schedule-approval' | 'modify-schedule' | 'view-plan';

export interface UserData {
  name: string;
  age: string;
  height: string;
  weight: string;
  gender: string;
  bodyFat: string;
  muscleMass: string;
  dietStyle: string;
  dailyMeals: string;
  dailyCalories: string;
  proteinIntake: string;
  currentProgram: string;
  benchPress: string;
  squat: string;
  deadlift: string;
  overheadPress: string;
  pullUps: string;
  rows: string;
  primaryGoal: string;
  secondaryGoal: string;
  weeklyAvailability: string;
  preferredDays: string[];
  additionalSpecs?: any;
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [pendingPlan, setPendingPlan] = useState<WorkoutPlan | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const { setWorkoutPlan, workoutPlan } = useWorkoutPlan();
  const { toast } = useToast();

  const handleOnboardingComplete = async (data: UserData) => {
    setUserData(data);
    setIsGeneratingPlan(true);
    
    try {
      toast({
        title: "Generating Your Plan",
        description: "Our AI is creating a personalized workout plan for you...",
      });
      
      const workoutPlan = await googleAIService.generateWorkoutPlan(data);
      setPendingPlan(workoutPlan);
      setAppState('schedule-approval');
    } catch (error) {
      console.error('Error generating workout plan:', error);
      toast({
        title: "Error",
        description: "Failed to generate workout plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleScheduleApproved = (plan: WorkoutPlan) => {
    setWorkoutPlan(plan);
    setPendingPlan(null);
    setIsGeneratingPlan(false);
    setAppState('dashboard');
    toast({
      title: "Plan Activated!",
      description: "Your personalized workout plan is now ready to use.",
    });
  };

  const handlePlanModification = async (modifiedPlan: WorkoutPlan) => {
    setPendingPlan(modifiedPlan);
    // Stay in schedule-approval state to show the updated plan
  };

  const handleStartWorkout = () => {
    setAppState('workout');
  };

  const handleWorkoutComplete = () => {
    setAppState('dashboard');
  };

  const handleWorkoutExit = () => {
    setAppState('dashboard');
  };

  const handleModifySchedule = () => {
    setAppState('modify-schedule');
  };

  const handleViewPlan = () => {
    setAppState('view-plan');
  };

  if (appState === 'onboarding') {
    return (
      <>
        <DarkModeToggle />
        <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-secondary p-4 flex items-center justify-center">
          {isGeneratingPlan ? (
            <LoadingAnimation message="Our AI is analyzing your profile and creating a personalized workout plan..." />
          ) : (
            <Card className="w-full max-w-4xl p-8 bg-glass/30 backdrop-blur-glass border-glass-border shadow-elevated">
              <OnboardingForm onComplete={handleOnboardingComplete} />
            </Card>
          )}
        </div>
      </>
    );
  }

  if (appState === 'schedule-approval' && pendingPlan) {
    return (
      <>
        <DarkModeToggle />
        <ScheduleApproval
          workoutPlan={pendingPlan}
          onApprove={handleScheduleApproved}
          onModify={handlePlanModification}
          isOpen={true}
          onClose={() => setAppState('onboarding')}
        />
      </>
    );
  }

  if (appState === 'dashboard') {
    return (
      <>
        <DarkModeToggle />
        {userData && <RexChatbot userData={userData} workoutPlan={workoutPlan} onPlanModified={setWorkoutPlan} />}
        <Dashboard 
          userName={userData?.name || 'User'} 
          onStartWorkout={handleStartWorkout}
          onModifySchedule={handleModifySchedule}
          onViewPlan={handleViewPlan}
        />
        <QuoteTicker />
      </>
    );
  }

  if (appState === 'modify-schedule') {
    return (
      <>
        <DarkModeToggle />
        <RexChatbot userData={userData} workoutPlan={workoutPlan} />
        <ModifySchedule 
          workoutPlan={workoutPlan}
          onBack={() => setAppState('dashboard')}
          onPlanUpdated={(updatedPlan) => {
            setWorkoutPlan(updatedPlan);
            setAppState('dashboard');
          }}
          userData={userData}
        />
      </>
    );
  }

  if (appState === 'view-plan') {
    return (
      <>
        <DarkModeToggle />
        <ViewPlan 
          workoutPlan={workoutPlan}
          onBack={() => setAppState('dashboard')}
        />
      </>
    );
  }

  if (appState === 'workout') {
    return (
      <>
        <DarkModeToggle />
        <RexChatbot userData={userData} workoutPlan={workoutPlan} isWorkoutMode={true} />
        <WorkoutSession
          onComplete={handleWorkoutComplete}
          onExit={handleWorkoutExit}
        />
      </>
    );
  }

  // Landing Page
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface-secondary">
      <DarkModeToggle />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Text */}
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-accent" />
                  <span className="text-accent font-medium">AI-Powered Fitness</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  Transform Your{' '}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Fitness Journey
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Get personalized workout plans, track your progress with precision, 
                  and achieve your fitness goals with AI-powered insights.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="xl" 
                  variant="accent" 
                  onClick={() => setAppState('onboarding')}
                  className="flex items-center gap-2 animate-glow-pulse"
                >
                  <Play className="w-5 h-5" />
                  Start Your Journey
                </Button>
                <Button 
                  size="xl" 
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="w-5 h-5" />
                  See Demo
                </Button>
              </div>

              {/* Stats */}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Everything You Need to{' '}
              <span className="text-primary">Succeed</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform adapts to your needs, creating personalized 
              experiences that evolve with your progress.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <Card className="p-8 bg-glass/30 backdrop-blur-glass border-glass-border shadow-glass hover:shadow-elevated transition-all duration-300 hover:scale-105">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary to-primary-light rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">AI Workout Generation</h3>
                <p className="text-muted-foreground">
                  Get custom workout plans tailored to your goals, equipment, 
                  and schedule. Our AI learns from your progress and adapts.
                </p>
              </div>
            </Card>

            {/* Feature 2 */}
            <Card className="p-8 bg-glass/30 backdrop-blur-glass border-glass-border shadow-glass hover:shadow-elevated transition-all duration-300 hover:scale-105">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gradient-to-r from-secondary to-secondary-light rounded-2xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Progress Tracking</h3>
                <p className="text-muted-foreground">
                  Visualize your journey with detailed analytics, PR tracking, 
                  and performance insights that keep you motivated.
                </p>
              </div>
            </Card>

            {/* Feature 3 */}
            <Card className="p-8 bg-glass/30 backdrop-blur-glass border-glass-border shadow-glass hover:shadow-elevated transition-all duration-300 hover:scale-105">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gradient-to-r from-accent to-accent-glow rounded-2xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold">Smart Goal Setting</h3>
                <p className="text-muted-foreground">
                  Set realistic, achievable goals with our intelligent system 
                  that adjusts based on your progress and lifestyle.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="p-12 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 backdrop-blur-glass shadow-elevated">
            <div className="space-y-6">
              <Zap className="w-16 h-16 mx-auto text-accent animate-glow-pulse" />
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Level Up Your Fitness?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of fitness enthusiasts who have transformed their 
                bodies and minds with our AI-powered training system.
              </p>
              <Button 
                size="xl" 
                variant="accent" 
                onClick={() => setAppState('onboarding')}
                className="flex items-center gap-2 mx-auto animate-glow-pulse"
              >
                <Dumbbell className="w-5 h-5" />
                Get Started Free
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
