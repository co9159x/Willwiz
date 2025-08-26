// Heatmap instrumentation for tracking user behavior and wizard completion
// This is a stub implementation for MVP - will be expanded in Phase 2

export interface HeatmapEvent {
  event: string;
  step?: string;
  timeOnStep?: number;
  userId: string;
  tenantId: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

class HeatmapTracker {
  private events: HeatmapEvent[] = [];

  // Track wizard step completion
  trackStepCompletion(userId: string, tenantId: string, step: string, timeOnStep: number, metadata?: Record<string, any>) {
    const event: HeatmapEvent = {
      event: 'WIZARD_STEP_COMPLETED',
      step,
      timeOnStep,
      userId,
      tenantId,
      timestamp: new Date(),
      metadata,
    };

    this.events.push(event);
    this.persistEvent(event);
  }

  // Track step abandonment
  trackStepAbandonment(userId: string, tenantId: string, step: string, timeOnStep: number, metadata?: Record<string, any>) {
    const event: HeatmapEvent = {
      event: 'WIZARD_STEP_ABANDONED',
      step,
      timeOnStep,
      userId,
      tenantId,
      timestamp: new Date(),
      metadata,
    };

    this.events.push(event);
    this.persistEvent(event);
  }

  // Track will completion
  trackWillCompletion(userId: string, tenantId: string, willId: string, totalTime: number, stepsCompleted: number) {
    const event: HeatmapEvent = {
      event: 'WILL_COMPLETED',
      userId,
      tenantId,
      timestamp: new Date(),
      metadata: {
        willId,
        totalTime,
        stepsCompleted,
      },
    };

    this.events.push(event);
    this.persistEvent(event);
  }

  // Track button clicks and interactions
  trackInteraction(userId: string, tenantId: string, action: string, location: string, metadata?: Record<string, any>) {
    const event: HeatmapEvent = {
      event: 'USER_INTERACTION',
      userId,
      tenantId,
      timestamp: new Date(),
      metadata: {
        action,
        location,
        ...metadata,
      },
    };

    this.events.push(event);
    this.persistEvent(event);
  }

  // Get events for a specific tenant (for analytics)
  getTenantEvents(tenantId: string, startDate?: Date, endDate?: Date): HeatmapEvent[] {
    let filteredEvents = this.events.filter(event => event.tenantId === tenantId);

    if (startDate) {
      filteredEvents = filteredEvents.filter(event => event.timestamp >= startDate);
    }

    if (endDate) {
      filteredEvents = filteredEvents.filter(event => event.timestamp <= endDate);
    }

    return filteredEvents;
  }

  // Get step completion rates
  getStepCompletionRates(tenantId: string): Record<string, { completed: number; abandoned: number; rate: number }> {
    const tenantEvents = this.getTenantEvents(tenantId);
    const stepStats: Record<string, { completed: number; abandoned: number; rate: number }> = {};

    tenantEvents.forEach(event => {
      if (event.step && (event.event === 'WIZARD_STEP_COMPLETED' || event.event === 'WIZARD_STEP_ABANDONED')) {
        if (!stepStats[event.step]) {
          stepStats[event.step] = { completed: 0, abandoned: 0, rate: 0 };
        }

        if (event.event === 'WIZARD_STEP_COMPLETED') {
          stepStats[event.step].completed++;
        } else {
          stepStats[event.step].abandoned++;
        }
      }
    });

    // Calculate completion rates
    Object.keys(stepStats).forEach(step => {
      const total = stepStats[step].completed + stepStats[step].abandoned;
      stepStats[step].rate = total > 0 ? (stepStats[step].completed / total) * 100 : 0;
    });

    return stepStats;
  }

  // Get average time on step
  getAverageTimeOnStep(tenantId: string, step: string): number {
    const tenantEvents = this.getTenantEvents(tenantId);
    const stepEvents = tenantEvents.filter(event => 
      event.step === step && 
      event.event === 'WIZARD_STEP_COMPLETED' && 
      event.timeOnStep
    );

    if (stepEvents.length === 0) return 0;

    const totalTime = stepEvents.reduce((sum, event) => sum + (event.timeOnStep || 0), 0);
    return totalTime / stepEvents.length;
  }

  // Get drop-off points (steps with highest abandonment)
  getDropOffPoints(tenantId: string): Array<{ step: string; abandonmentRate: number; totalAttempts: number }> {
    const stepStats = this.getStepCompletionRates(tenantId);
    const dropOffs = Object.entries(stepStats)
      .map(([step, stats]) => ({
        step,
        abandonmentRate: 100 - stats.rate,
        totalAttempts: stats.completed + stats.abandoned,
      }))
      .filter(item => item.totalAttempts > 0)
      .sort((a, b) => b.abandonmentRate - a.abandonmentRate);

    return dropOffs;
  }

  // Persist event to database (stub - will be implemented in Phase 2)
  private async persistEvent(event: HeatmapEvent) {
    // In Phase 2, this will save to a dedicated heatmap table
    // For MVP, we'll just log to console
    console.log('Heatmap Event:', {
      event: event.event,
      step: event.step,
      userId: event.userId,
      tenantId: event.tenantId,
      timestamp: event.timestamp.toISOString(),
      metadata: event.metadata,
    });

    // TODO: Implement database persistence
    // await prisma.heatmapEvent.create({
    //   data: {
    //     event: event.event,
    //     step: event.step,
    //     timeOnStep: event.timeOnStep,
    //     userId: event.userId,
    //     tenantId: event.tenantId,
    //     timestamp: event.timestamp,
    //     metadata: event.metadata ? JSON.stringify(event.metadata) : null,
    //   },
    // });
  }

  // Clear events (for testing)
  clearEvents() {
    this.events = [];
  }
}

// Export singleton instance
export const heatmapTracker = new HeatmapTracker();

// Export convenience functions
export const trackStepCompletion = (
  userId: string, 
  tenantId: string, 
  step: string, 
  timeOnStep: number, 
  metadata?: Record<string, any>
) => {
  heatmapTracker.trackStepCompletion(userId, tenantId, step, timeOnStep, metadata);
};

export const trackStepAbandonment = (
  userId: string, 
  tenantId: string, 
  step: string, 
  timeOnStep: number, 
  metadata?: Record<string, any>
) => {
  heatmapTracker.trackStepAbandonment(userId, tenantId, step, timeOnStep, metadata);
};

export const trackWillCompletion = (
  userId: string, 
  tenantId: string, 
  willId: string, 
  totalTime: number, 
  stepsCompleted: number
) => {
  heatmapTracker.trackWillCompletion(userId, tenantId, willId, totalTime, stepsCompleted);
};

export const trackInteraction = (
  userId: string, 
  tenantId: string, 
  action: string, 
  location: string, 
  metadata?: Record<string, any>
) => {
  heatmapTracker.trackInteraction(userId, tenantId, action, location, metadata);
};
