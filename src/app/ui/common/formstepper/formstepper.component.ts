import { CommonModule, NgFor } from '@angular/common';
import { Component, computed, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Lead, LeadStatus, LeadsUpdateStatus } from '../../../models/lead.model';
import { UpdateFormComponent } from "../update-form/update-form.component";

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

export type StepData = {
  title: string;
  description: string;
  key: LeadStatus;
  isComplete: boolean;
  progress: boolean;
  updates?: {
    title: string;
    createdAt: string;
    isComplete: boolean;
    files?: {
      path: string;
      name: string;
    }[]
  }[];
}

@Component({
  selector: 'app-formstepper',
  imports: [MatIconModule, NgFor, CommonModule, UpdateFormComponent],
  templateUrl: './formstepper.component.html',
  styleUrl: './formstepper.component.css'
})
export class FormstepperComponent {
  @Input() title: string = 'How this works?';
  @Input() lead!: Lead;
  @Input() showDetailsSteps: boolean = true;
  stepData = computed(() => this.generateStepData().map(this.addClassesForStep));


  openFile = (file: string) => {
    window.open(file, '_blank');
  }

  addClassesForStep = (step: StepData) => {
    return {
      ...step,
      statusClass: step.isComplete ? 'completed' : step.progress ? 'in-progress' : 'pending',
    }
  }

  getUpdateTitle = (update: LeadsUpdateStatus) => {
    switch (update.stepName) {
      case 'submit_data':
        return update.isComplete ? 'Vehicle Data Submitted' : 'Vehicle Data Submitted';
      case 'review_data':
        return update.isComplete ? 'Review Started' : 'Review Completed';
      case 'gen_cert_1':
        return update.isComplete ? 'Generating Certificate 1' : 'Certificate 1 Generated';
      case 'await_submission':
        return update.isComplete ? 'Waiting for Vehicle Submission' : 'Vehicle Submitted';
      case 'complete':
        return update.isComplete ? 'Completed' : 'Completed';
      default:
        return update.stepName;
    }
  }

  getUpdateDateTime = (update: LeadsUpdateStatus) => {
    // format: 12 Dec 2024, 12:00 PM
    return new Date(update.createdAt).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  }

  generateStepData = (): StepData[] => {
    if (!this.lead) {
      return baseStep.map(step => {
        return {
          ...step,
          isComplete: false,
          progress: step.key === 'submit_data',
        }
      });
    }
    if (this.showDetailsSteps) {
      const flatUpdates = this.lead.statusUpdates.reverse().map(update => {
        return {
          key: update.stepName,
          title: this.getUpdateTitle(update),
          createdAt: this.getUpdateDateTime(update),
          isComplete: update.isComplete,
          files: update.files.map((file, i) => ({
            path: `http://localhost:3000/uploads/${file}`,
            name: `File ${i + 1}`,
          })),
        }
      })
      const detailedUpdates = baseStep.map(step => {
        const update = flatUpdates.filter(update => update.key === step.key);
        return {
          ...step,
          updates: update,
          isComplete: update.reduce((acc, curr) => acc || curr.isComplete, false),
          progress: false,
        }
      })
      let lastCompleteIndex = -1
      for (let i = detailedUpdates.length - 1; i >= 0; i--) {
        if (detailedUpdates[i].isComplete) {
          lastCompleteIndex = i;
          break;
        }
      }
      if (lastCompleteIndex !== -1 && lastCompleteIndex < detailedUpdates.length - 1) {
        detailedUpdates[lastCompleteIndex + 1].progress = true;
      }

      return detailedUpdates;
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
