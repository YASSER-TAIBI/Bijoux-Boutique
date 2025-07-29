import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { UserAdminService, AdminUser, UsersResponse } from '../../../services/user-admin.service';
import { AuthService } from '../../../services/auth.service';
import { fadeSlideInAnimation } from '../../../animations/shared.animations';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations: [fadeSlideInAnimation]
})
export class UsersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  admins: AdminUser[] = [];
  users: AdminUser[] = [];
  filteredAdmins: AdminUser[] = [];
  filteredUsers: AdminUser[] = [];
  
  isLoading = false;
  error: string | null = null;
  
  // Modal states
  showCreateModal = false;
  showEditModal = false;
  showDeleteModal = false;
  showRoleModal = false;
  
  selectedUser: AdminUser | null = null;
  currentUserId: string | null = null;
  
  // Forms
  createForm: FormGroup;
  editForm: FormGroup;
  
  // Search and filter
  searchTerm = '';
  selectedRole: 'all' | 'user' | 'admin' = 'all';
  
  constructor(
    private userAdminService: UserAdminService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.currentUserId = this.authService.getCurrentUserId();
    
    this.createForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: [''],
      address: [''],
      role: ['user', Validators.required],
      civility: ['Mr', Validators.required]
    });
    
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
      role: ['user', Validators.required],
      civility: ['Mr', Validators.required]
    });
  }
  
  ngOnInit(): void {
    this.loadUsers();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadUsers(): void {
    this.isLoading = true;
    this.error = null;
    
    this.userAdminService.getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: UsersResponse) => {
          this.admins = response.admins;
          this.users = response.users;
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          this.error = 'Erreur lors du chargement des utilisateurs';
          console.error('Erreur:', error);
          this.isLoading = false;
        }
      });
  }
  
  applyFilters(): void {
    const term = this.searchTerm.toLowerCase();
    
    // Filtrer les admins
    this.filteredAdmins = this.admins.filter(admin => 
      admin.name.toLowerCase().includes(term) || 
      admin.email.toLowerCase().includes(term)
    );
    
    // Filtrer les utilisateurs
    this.filteredUsers = this.users.filter(user => 
      user.name.toLowerCase().includes(term) || 
      user.email.toLowerCase().includes(term)
    );
    
    // Appliquer le filtre de rôle
    if (this.selectedRole === 'admin') {
      this.filteredUsers = [];
    } else if (this.selectedRole === 'user') {
      this.filteredAdmins = [];
    }
  }
  
  onSearchChange(): void {
    this.applyFilters();
  }
  
  onRoleFilterChange(): void {
    this.applyFilters();
  }
  
  // Modal management
  openCreateModal(): void {
    this.createForm.reset();
    this.createForm.patchValue({ role: 'user' });
    this.showCreateModal = true;
  }
  
  openEditModal(user: AdminUser): void {
    this.selectedUser = user;
    this.editForm.patchValue({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      role: user.role,
      civility: user.civility || 'Mr'
    });
    this.showEditModal = true;
  }
  
  openDeleteModal(user: AdminUser): void {
    this.selectedUser = user;
    this.showDeleteModal = true;
  }
  
  openRoleModal(user: AdminUser): void {
    this.selectedUser = user;
    this.showRoleModal = true;
  }
  
  closeModals(): void {
    this.showCreateModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.showRoleModal = false;
    this.selectedUser = null;
  }
  
  // CRUD Operations
  createUser(): void {
    if (this.createForm.valid) {
      this.isLoading = true;
      
      this.userAdminService.createUser(this.createForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadUsers();
            this.closeModals();
            this.isLoading = false;
          },
          error: (error) => {
            this.error = error.error?.message || 'Erreur lors de la création de l\'utilisateur';
            this.isLoading = false;
          }
        });
    }
  }
  
  updateUser(): void {
    if (this.editForm.valid && this.selectedUser) {
      this.isLoading = true;
      const userId = this.selectedUser.id || this.selectedUser._id!;
      
      this.userAdminService.updateUser(userId, this.editForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadUsers();
            this.closeModals();
            this.isLoading = false;
          },
          error: (error) => {
            this.error = error.error?.message || 'Erreur lors de la mise à jour de l\'utilisateur';
            this.isLoading = false;
          }
        });
    }
  }
  
  deleteUser(): void {
    if (this.selectedUser) {
      this.isLoading = true;
      const userId = this.selectedUser.id || this.selectedUser._id!;
      
      this.userAdminService.deleteUser(userId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadUsers();
            this.closeModals();
            this.isLoading = false;
          },
          error: (error) => {
            this.error = error.error?.message || 'Erreur lors de la suppression de l\'utilisateur';
            this.isLoading = false;
          }
        });
    }
  }
  
  updateRole(newRole: 'user' | 'admin'): void {
    if (this.selectedUser) {
      this.isLoading = true;
      const userId = this.selectedUser.id || this.selectedUser._id!;
      
      this.userAdminService.updateUserRole(userId, newRole)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.loadUsers();
            this.closeModals();
            this.isLoading = false;
          },
          error: (error) => {
            this.error = error.error?.message || 'Erreur lors de la mise à jour du rôle';
            this.isLoading = false;
          }
        });
    }
  }
  
  // Helper methods
  canDeleteUser(user: AdminUser): boolean {
    const userId = user.id || user._id;
    return userId !== this.currentUserId;
  }
  
  canChangeRole(user: AdminUser): boolean {
    const userId = user.id || user._id;
    return userId !== this.currentUserId;
  }
  
  getRoleBadgeClass(role: string): string {
    return role === 'admin' ? 'badge-admin' : 'badge-user';
  }
  
  formatDate(date: Date | string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-FR');
  }
}
