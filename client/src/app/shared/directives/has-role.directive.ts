import { Directive, Input, TemplateRef, ViewContainerRef, inject, effect } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRoleDirective {
  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private currentRole = '';

  @Input() set appHasRole(role: string) {
    this.currentRole = role;
    this.updateView();
  }

  constructor() {
    effect(() => {
      this.updateView();
    });
  }

  private updateView() {
    const user = this.authService.currentUser();
    if (user && user.role === this.currentRole) {
      if (this.viewContainer.length === 0) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    } else {
      this.viewContainer.clear();
    }
  }
}
