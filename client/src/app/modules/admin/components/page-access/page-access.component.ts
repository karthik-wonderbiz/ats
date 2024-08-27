import { Component, OnInit } from '@angular/core';
import { AccessPageService } from '../../../../services/accessPage/access-page.service';
import { AccessPageModel } from '../../../../model/AccessPageModel';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-page-access',
  templateUrl: './page-access.component.html',
  styleUrls: ['./page-access.component.css'],
})
export class PageAccessComponent implements OnInit {
  selectedRole: string = '2';
  roles: any[] = [];
  allRoles: any[] = [];
  pages: any[] = [];
  allPages: any[] = [];

  isAddPageModalOpen = false;
  newPage = {
    roleId: '2',
    pageId: '',
  };

  columns = [
    { key: 'pageName', label: 'Page Name' },
    { key: 'isActive', label: 'Select' },
    { key: 'delete', label: 'Delete' }
  ];

  constructor(private pageService: AccessPageService) {}

  ngOnInit(): void {
    this.getAccessPageDetails();
    this.getAllPages();
    this.getAllRoles();
  }

  saveAccessSettings() {
    const pageAccessData = this.pages.map((page) => ({
      id: page.id,
      roleId: parseInt(this.selectedRole, 10),
      pageId: page.pageId,
      isActive: page.isActive ? 1 : 0,
    }));

    this.pageService.updatePageDetails(pageAccessData).subscribe(
      (response) => {
        Swal.fire({
          title: 'Success!',
          text: 'Page access settings updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      },
      (error) => {
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update page access settings.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    );
  }

  getAccessPageDetails() {
    this.pageService
      .getAccessPageDetailsByRoleId(this.selectedRole)
      .subscribe((data: AccessPageModel[]) => {
        this.pages = data.map((page) => ({
          id: page.id,
          pageId: page.pageId,
          pageName: page.pageTitle,
          isActive: page.isActive,
        }));
      });
  }

  getAllPages() {
    this.pageService.getAllPages().subscribe((data: any[]) => {
      this.allPages = data.map((page) => ({
        pageId: page.id,
        pageName: page.pageTitle,
        isActive: false,
      }));
      console.log('All Pages', this.allPages);
    });
  }

  getAllRoles() {
    this.pageService.getAllRoles().subscribe((data) => {
      this.allRoles = data;
      console.log('All roles', this.allRoles);
    });
  }

  openAddPageModal() {
    this.isAddPageModalOpen = true;
  }

  closeAddPageModal() {
    if (this.newPage.pageId !== '') {
      Swal.fire({
        title: 'Unsaved Changes',
        text: 'You have unsaved changes. Are you sure you want to close?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, close it!',
        cancelButtonText: 'No, keep editing',
      }).then((result) => {
        if (result.isConfirmed) {
          this.isAddPageModalOpen = false;
          this.resetNewPageForm();
        }
      });
    } else {
      this.isAddPageModalOpen = false;
      this.resetNewPageForm();
    }
  }

  addNewPage() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to add this page?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, add it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        const newPageData = {
          roleId: parseInt(this.newPage.roleId, 10),
          pageId: this.newPage.pageId,
        };

        this.pageService.addNewPage(newPageData).subscribe(
          (response) => {
            console.log('API Response:', response);
            if (response) {
              if (response && response.length > 0) {
                this.pages.push(...response);
                this.closeAddPageModal();
              }
              Swal.fire({
                title: 'Added!',
                text: 'New page has been added successfully.',
                icon: 'success',
                showConfirmButton: false,
                timer: 2000
              });
              this.isAddPageModalOpen = false;
            } else {
              Swal.fire({
                title: 'No Data',
                text: 'No new page data was returned.',
                icon: 'warning',
                showConfirmButton: false,
                timer: 2000
              });
            }
          },
          (error) => {
            console.error('Error adding new page:', error);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to add new page.',
              icon: 'error',
              confirmButtonText: 'OK',
            });
          }
        );
      }
    });
  }

  onDeleteClicked(page: any) {
    if (page && page.id) {
      Swal.fire({
        title: 'Are you sure?',
        text: `Do you really want to delete ${page.pageName}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.pageService.deletePage(page.id).subscribe(
            (data) => {
              Swal.fire({
                title: 'Deleted!',
                text: `${page.pageName} has been deleted.`,
                showConfirmButton: false,
                icon: 'success',
                timer: 2000
              });
              this.getAccessPageDetails();
            },
            (error) => {
              Swal.fire(
                'Error!',
                'There was a problem deleting the employee.',
                'error'
              );
            }
          );
        }
      });
    } else {
      console.error('Employee ID is missing or data is incorrect');
    }
  }

  resetNewPageForm() {
    this.newPage = {
      roleId: this.selectedRole,
      pageId: '',
    };
  }
}
