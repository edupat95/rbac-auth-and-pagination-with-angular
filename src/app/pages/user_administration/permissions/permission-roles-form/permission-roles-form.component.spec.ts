import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissionRolesFormComponent } from './permission-roles-form.component';

describe('PermissionRolesFormComponent', () => {
  let component: PermissionRolesFormComponent;
  let fixture: ComponentFixture<PermissionRolesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermissionRolesFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PermissionRolesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
