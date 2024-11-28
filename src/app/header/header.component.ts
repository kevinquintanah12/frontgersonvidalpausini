import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importar Router
import { GraphqlHeaderService } from '../services/header.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  // Propiedades del formulario
  name: string = '';
  description: string = '';
  imageUrl: string = '';
  email: string = '';
  phoneNumber: string = '';
  location: string = '';
  github: string = '';

  token: string = '';

  constructor(
    private headerService: GraphqlHeaderService,
    private storageService: StorageService,
    private router: Router // Inyectar el Router aquí
  ) {}

  ngOnInit(): void {
    // Obtén el token desde el almacenamiento de sesión
    this.token = this.storageService.getSession('token');
    if (!this.token) {
      console.error('Token no encontrado. El usuario debe iniciar sesión.');
    }
  }

  /**
   * Maneja la acción de guardar un nuevo header
   */
  saveHeader(): void {
    if (!this.token) {
      alert('Token no encontrado. Inicia sesión nuevamente.');
      return;
    }

    window.alert(
      'Recuerda: solo puedes crear un header por usuario. Si deseas editar o eliminar tu header, hazlo después de guardar.'
    );

    // Crear un objeto para el nuevo header
    const newHeader = {
      name: this.name,
      description: this.description,
      imageUrl: this.imageUrl,
      email: this.email,
      phoneNumber: this.phoneNumber,
      location: this.location,
      github: this.github,
    };

    // Llamar al servicio para crear el header
    this.headerService.createHeader(newHeader, this.token).subscribe(
      (response: any) => {
        console.log('Header creado:', response.data.createHeader);
        alert('Header creado exitosamente');

        // Redirigir a la página de experiencia laboral
        this.router.navigate(['/home']);
        
        this.resetForm();
      },
      (error) => {
        console.error('Error al crear el header:', error);
        alert('Hubo un error al crear el header.');
      }
    );
  }

  /**
   * Restablece los campos del formulario
   */
  resetForm(): void {
    this.name = '';
    this.description = '';
    this.imageUrl = '';
    this.email = '';
    this.phoneNumber = '';
    this.location = '';
    this.github = '';
  }
}
