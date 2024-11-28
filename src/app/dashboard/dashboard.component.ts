import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { StorageService } from '../services/storage.service';
import { GraphqlHeaderService } from '../services/header.service';
import { Router } from '@angular/router';
import { GraphqlWorkExperienceService } from '../services/workexperience.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  currentUser: any = null; // Datos del usuario actual
  token: string = ''; // Token del usuario
  headers: any[] = []; // Lista de headers obtenidos
  workExperiences: any[] = [];



  constructor(
   
    private userService: UserService,
    private storageService: StorageService,
    private graphqlHeaderService: GraphqlHeaderService,
    private graphqlWorkExperienceService: GraphqlWorkExperienceService,

    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener el token desde el almacenamiento de sesión
    this.token = this.storageService.getSession('token');
    if (!this.token) {
      console.error('Token no encontrado. El usuario debe iniciar sesión.');
      alert('Debes iniciar sesión para acceder al dashboard.');
      this.router.navigate(['/login']); // Redirige al login si no hay token
      return;
    }

    // Obtener datos del usuario actual
    



    // Obtener todos los headers
    this.graphqlHeaderService.getHeaders('*', this.token).subscribe(
      (response: any) => {
        if (response && response.data && response.data.headers) {
          this.headers = response.data.headers; // Asigna la lista de headers
          console.log('Headers obtenidos:', this.headers);
        } else {
          console.error('No se encontraron headers.');
        }
      },
      (error) => {
        console.error('Error al obtener los headers:', error);
        alert('Hubo un error al cargar los headers.');
      }
    );

  
    this.graphqlWorkExperienceService.getWorkExperiences(this.token).subscribe(
      (response: any) => {
        if (response && response.data && response.data.experiences) {
          this.workExperiences = response.data.experiences;
          
        } else {
          console.error('No se encontraron experiencias laborales.');
        }
      },
      (error) => {
        // Mostrar el error completo en la consola
        console.error('Error al obtener las experiencias laborales:', error);
    
        // Verificar si error tiene una estructura esperada
        if (error && error.response) {
          console.error('Error detallado:', error.response);
          alert(`Error al cargar las experiencias laborales: ${error.response}`);
        } else if (error && error.message) {
          // En caso de que el error tenga solo un mensaje
          console.error('Mensaje de error:', error.message);
          alert(`Hubo un error: ${error.message}`);
        } else {
          console.error('Error desconocido', error);
          alert('Hubo un error desconocido al cargar las experiencias laborales.');
        }
      }
    );
    

    
  }


  

  


  

  // Función para redirigir a la página de creación
  onCreateNew(): void {
    // Verifica si ya existe un header
    if (this.headers.length > 0) {
      const confirmCreation = confirm('Ya existe un header. Si creas uno nuevo, reemplazará el existente. ¿Quieres continuar?');
      if (!confirmCreation) {
        return; // Si el usuario cancela, no hace nada
      }
    }
    this.router.navigate(['/header']); // Redirige a la ruta de creación

  }

  // Función para redirigir a la página de edición
  onEdit(): void {
    const selectedHeader = this.headers[0]; // Asumiendo que siempre editarás el primer header (puedes cambiar esto)
    if (!selectedHeader) {
      alert('No hay headers disponibles para editar.');
      return;
    }
    this.router.navigate(['/header']); // Redirige a la ruta de edición con el ID del header

  }


  // Función para redirigir a la página de creación de experiencia laboral
  onCreateExperience(): void {
    this.router.navigate(['/workexperience']);

  }

  onEditExperience(id: number): void {
    this.router.navigate([`/workexperience/${id}`]);

  }
  

  onDeleteExperience(idWorkExperience: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta experiencia laboral?')) {
      const id = Number(idWorkExperience); // Asegúrate de que sea un número válido
  
      this.graphqlWorkExperienceService.deleteExperience(id, this.token).subscribe(
        (response) => {
          console.log('Experiencia eliminada con éxito:', response);
          this.workExperiences = this.workExperiences.filter(exp => exp.id !== id);
          alert('Experiencia eliminada correctamente');
          window.location.reload(); // Recarga la página

        },
        (error) => {
          console.error('Error al eliminar la experiencia laboral:', error);
  
          // Verificar detalles del error
          if (error.networkError) {
            console.error('Error de red:', error.networkError);
            alert('Error de red al intentar eliminar la experiencia laboral. Por favor, revisa tu conexión.');
          }
  
          if (error.graphQLErrors && error.graphQLErrors.length > 0) {
            error.graphQLErrors.forEach((err: any) => {
              console.error('Error de GraphQL:', err.message);
              alert(`Error del servidor: ${err.message}`);
            });
          }
  
          // Mensaje genérico en caso de que no se pueda identificar la causa exacta
          alert('Hubo un error desconocido al eliminar la experiencia laboral.');
        }
      );
    }
  }



   


  onDelete(headerId: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este header?')) {
      // Asegurarte de que headerId sea un número entero
      const id = Number(headerId); // O puedes usar parseInt(headerId, 10);
      
      if (isNaN(id)) {
        console.error('El ID proporcionado no es un número válido');
        alert('ID no válido');
        return;
      }
  
      this.graphqlHeaderService.deleteHeader(id, this.token).subscribe(
        (response) => {
          console.log('Header eliminado:', response);
          this.headers = this.headers.filter(header => header.id !== id); // Actualizar la lista de headers
          alert('Header eliminado correctamente');
          window.location.reload(); // Recarga la página

        },
        (error) => {
          console.error('Error al eliminar el header:', error);
          console.error('Detalles del error:', error.networkError); // Agregar detalles sobre el error
          alert('Hubo un error al eliminar el header');
        }
      );
    }
  }
  
      
    
}
