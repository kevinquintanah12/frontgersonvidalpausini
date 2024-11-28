import { Component, OnInit } from '@angular/core';
import { GraphqlWorkExperienceService } from '../services/workexperience.service';
import { StorageService } from '../services/storage.service';
import { Router } from '@angular/router'; // Importar Router

@Component({
  selector: 'app-workexperience',
  templateUrl: './workexperience.component.html',
  styleUrls: ['./workexperience.component.css'],
})
export class WorkexperienceComponent implements OnInit {
  role: string = '';
  company: string = '';
  accomplishments: string = '';
  startDate: string = '';
  endDate: string = '';
  location: string = '';

  token: string = '';

  constructor(
    private workExperienceService: GraphqlWorkExperienceService,
    private storageService: StorageService,
    private router: Router // Inyectar el Router aquí

  ) {}

  ngOnInit(): void {
    this.token = this.storageService.getSession('token');
    if (!this.token) {
      console.error('Token no encontrado. El usuario debe iniciar sesión.');
    }
  }

  saveWorkExperience(): void {
    if (!this.token) {
      alert('Token no encontrado. Inicia sesión nuevamente.');
      return;
    }

    const newWorkExperience = {
      role: this.role,
      company: this.company,
      accomplishments: this.accomplishments.split(','),
      startDate: this.startDate,
      endDate: this.endDate,
      location: this.location,
    };

    this.workExperienceService.createExperience(newWorkExperience, this.token).subscribe(
      (response: any) => {
        console.log('Experiencia laboral creada:', response.data.createWorkExperience);
        alert('Experiencia laboral creada exitosamente');
        this.resetForm();
        this.router.navigate(['/home']);
        

      },
      (error) => {
        // Manejo detallado del error
        if (error.graphQLErrors?.length) {
          console.error('GraphQL Errors:', error.graphQLErrors);
          alert(`Error de GraphQL: ${error.graphQLErrors[0].message}`);
        } else if (error.networkError) {
          console.error('Network Error:', error.networkError);
          alert('Error de red: No se pudo conectar al servidor.');
        } else {
          console.error('Error desconocido:', error);
          alert('Ocurrió un error desconocido.');
        }
      }
    );
  }

  resetForm(): void {
    this.role = '';
    this.company = '';
    this.accomplishments = '';
    this.startDate = '';
    this.endDate = '';
    this.location = '';
  }
}
