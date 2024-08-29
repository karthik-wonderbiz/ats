import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import Swal from 'sweetalert2';
import { UpdateEmployeeDetailsComponent } from '../modules/admin/components/update-employee-details/update-employee-details.component';

@Injectable({
  providedIn: 'root',
})
export class UnsavedChangesGuard implements CanDeactivate<UpdateEmployeeDetailsComponent> {

  async canDeactivate(component: UpdateEmployeeDetailsComponent): Promise<boolean> {
    // Check if the form is dirty
    if (component.isFormDirty()) {
      const result = await Swal.fire({
        title: 'Unsaved Changes',
        text: 'You have unsaved changes. Are you sure you want to leave?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, leave',
        cancelButtonText: 'No, stay',
      });
      return result.isConfirmed;
    }
    // If form is not dirty, allow navigation without prompt
    return true;
  }
}
