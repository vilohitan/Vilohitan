import { Injectable } from '@nestjs/common';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DeploymentProgress {
  private progress = new BehaviorSubject({
    status: 'DEPLOYING',
    timestamp: '2025-02-15 07:51:20',
    user: 'vilohitan',
    completedSteps: 0,
    totalSteps: 8
  });

  updateProgress(step: number, status: string) {
    this.progress.next({
      ...this.progress.value,
      completedSteps: step,
      status
    });
  }
}