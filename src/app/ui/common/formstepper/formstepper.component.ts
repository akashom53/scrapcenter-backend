import { CommonModule, NgFor } from '@angular/common';
import { Component, computed, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Lead, LeadStatus, LeadsUpdateStatus } from '../../../models/lead.model';
// 'submit_data' | 'review_data' | 'gen_cert_1' | 'await_submission' | 'complete'
const baseStep = [
  {
    title: 'Submit Vehicle Data',
    description: 'Provide vehicle details and submit the form.',
    key: 'submit_data' as LeadStatus
  },
  {
    title: 'Review',
    description: 'We\'ll review your submission within 2 working days',
    key: 'review_data' as LeadStatus
  },
  {
    title: 'Generating Certificate 1',
    description: 'Our Team will generate your certificate within X working days',
    key: 'gen_cert_1' as LeadStatus
  },
  {
    title: 'Awaiting Vehicle Submission',
    description: 'Arrange for the vehicle to be delivered within Y working days',
    key: 'await_submission' as LeadStatus
  },
  {
    title: 'Complete',
    description: 'Certificate 2 will be provided upon delivery of vehicle',
    key: 'complete' as LeadStatus
  },
]

type StepData = {
  title: string;
  description: string;
  key: LeadStatus;
  isComplete: boolean;
  progress: boolean;
  updates?: { title: LeadStatus; createdAt: string; isComplete: boolean; }[];
}

@Component({
  selector: 'app-formstepper',
  imports: [MatIconModule, NgFor, CommonModule],
  templateUrl: './formstepper.component.html',
  styleUrl: './formstepper.component.css'
})
export class FormstepperComponent {
  @Input() title: string = 'How this works?';
  @Input() lead!: Lead;
  @Input() showDetailsSteps: boolean = true;
  stepData = computed(() => this.generateStepData().map(this.addClassesForStep));


  addClassesForStep = (step: StepData) => {
    return {
      ...step,
      statusClass: step.isComplete ? 'completed' : step.progress ? 'in-progress' : 'pending',
    }
  }

  generateStepData = (): StepData[] => {
    if (this.showDetailsSteps) {
      const flatUpdates = this.lead.statusUpdates.map(update => {
        return {
          title: update.stepName,
          createdAt: update.createdAt,
          isComplete: update.isComplete,
        }
      })
      const detaiedUpdates = baseStep.map(step => {
        const update = flatUpdates.filter(update => update.title === step.key);
        return {
          ...step,
          updates: update,
          isComplete: update.reduce((acc, curr) => acc || curr.isComplete, false),
          progress: false,
        }
      })
      let lastCompleteIndex = -1
      for (let i = detaiedUpdates.length - 1; i >= 0; i--) {
        if (detaiedUpdates[i].isComplete) {
          lastCompleteIndex = i;
          break;
        }
      }
      if (lastCompleteIndex !== -1 && lastCompleteIndex < detaiedUpdates.length - 1) {
        detaiedUpdates[lastCompleteIndex + 1].progress = true;
      }

      return detaiedUpdates;
    } else {
      const currentStep = this.lead.getCurrentStatus();
      return baseStep.map(step => {
        return {
          ...step,
          isComplete: step.key === currentStep.stepKey,
          progress: false,
        }
      })
    }
  }

}
