import { Component, computed, inject, Input, OnInit, signal, Signal } from '@angular/core';
import { LeadDetailsComponent } from '../../common/lead-details/lead-details.component';
import { AppStore } from '../../../state/app.store';
import { ActivatedRoute } from '@angular/router';
import { FormstepperComponent } from "../../common/formstepper/formstepper.component";
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-lead',
  imports: [LeadDetailsComponent, FormstepperComponent, NgIf],
  templateUrl: './lead.component.html',
  styleUrl: './lead.component.css'
})
export class LeadComponent {
  private readonly appStore = inject(AppStore);
  private readonly route = inject(ActivatedRoute);
  lead = this.appStore.currentLead;

}
