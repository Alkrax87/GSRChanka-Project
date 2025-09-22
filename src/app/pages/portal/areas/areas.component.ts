import { Component, OnInit } from '@angular/core';
import { TableComponent } from "../../../components/table/table.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AreaService, Area } from '../../../services/area.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-areas',
  standalone: true,
  imports: [TableComponent, FormsModule, CommonModule, ReactiveFormsModule],
  template: `
  <h2>Listado de areas</h2>
  <button (click)="abrirModalAgregar()">➕ Agregar Área</button>
    
  <!-- Tu tabla reutilizable -->
  <app-table 
    [headers]="headers" 
    [data]="areas"
    (onShow)="verArea($event)"
    (onEdit)="abrirModalEditar($event)"
    (onDelete)="deleteArea($event)">
  </app-table>
    
  <!-- Modal Agregar -->
  <div *ngIf="modalAgregar" class="modal">
    <div class="modal-content">
      <h3>Agregar Nueva áreas</h3>
      <form (ngSubmit)="addArea()">
        <input [(ngModel)]="newArea.nombre" name="nombre" placeholder="Nombre" required />
        <input [(ngModel)]="newArea.responsable" name="responsable" placeholder="Responsable" required />
        <div style="margin-top:10px;">
          <button type="submit">Guardar</button>
          <button type="button" (click)="cerrarModalAgregar()">Cancelar</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal: Editar -->
    <div *ngIf="modalEditar" class="modal">
      <div class="modal-content">
        <h3>Editar Área</h3>
        <form (ngSubmit)="actualizarArea()">
          <input [(ngModel)]="editAreaData.nombre" name="nombre" placeholder="Nombre" required />
          <input [(ngModel)]="editAreaData.responsable" name="responsable" placeholder="Responsable" required />
          <button type="submit">Actualizar</button>
          <button type="button" (click)="cerrarModalEditar()">Cancelar</button>
        </form>
      </div>
    </div>

  <!-- Modal show(ver) -->
  <div *ngIf="selectedArea" class="modal">
    <div class="modal-content">
      <h3>Detalles del Área</h3>
      <p><strong>ID:</strong> {{ selectedArea.id }}</p>
      <p><strong>Nombre:</strong> {{ selectedArea.nombre }}</p>
      <p><strong>Responsable:</strong> {{ selectedArea.responsable }}</p>
      <button (click)="cerrarModal()">Cerrar</button>
    </div>
  </div>
  `,
  styles: [`
    .modal {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-content {
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      width: 300px;
    }
  `]
})
export class AreasComponent implements OnInit {
  headers = ['id', 'nombre', 'responsable']; //  columnas que mostrará tu tabla
  areas: Area[] = [];

  // Formularios
  newArea: Area = { nombre: '', responsable: '' };
  editAreaData: Area = { id: '', nombre: '', responsable: '' };

  // Estado de modales
  selectedArea: Area | null = null; // área seleccionada para "ver"
  modalAgregar = false; // 🔹 control para abrir/cerrar modal agregar
  modalEditar = false;
  
  constructor(private areaService: AreaService) {}

  ngOnInit() {
  this.areaService.getAreas().subscribe(data => {
    console.log('Datos que llegan de Firestore:', data);
    this.areas = data;
  });
}

  // -------- MODAL AGREGAR --------
  abrirModalAgregar() {
    this.modalAgregar = true;
  }

  cerrarModalAgregar() {
    this.modalAgregar = false;
    this.newArea = { id: '', nombre: '', responsable: '' };
  }

  addArea() {
  if (this.newArea.nombre && this.newArea.responsable) {
    const areaTmp = { ...this.newArea };
    this.newArea = { nombre: '', responsable: '' };
    this.modalAgregar = false; // cerrar primero

    this.areaService.addArea(areaTmp).catch(err => {
      console.error("Error al guardar área:", err);
      // 🔹 opcional: volver a abrir el modal si falla
      this.modalAgregar = true;
      });
    }
  }

  deleteArea(area: Area) {
    if (area.id) this.areaService.deleteArea(area.id);
  }

  // -------- MODAL EDITAR --------
  abrirModalEditar(area: Area) {
    this.editAreaData = { ...area }; // copiar datos del área
    this.modalEditar = true;
  }
  cerrarModalEditar() {
    this.modalEditar = false;
    
  }
  actualizarArea() {
    if (this.editAreaData.id) {
      const tmp = { ...this.editAreaData }; // copia rápida
      this.cerrarModalEditar(); // Scerrar inmediatamente el modal

      this.areaService.updateArea(tmp.id!, {
        nombre: tmp.nombre,
        responsable: tmp.responsable
      }).catch(err => {
        console.error("Error al actualizar área:", err);
        //opcional: volver a abrir el modal si falla
        this.editAreaData = tmp;
        this.modalEditar = true;
      });
    }
  }
  //MODAL SHOW(VER)
  verArea(area: Area) {
    if (area.id) {
      this.areaService.getAreaById(area.id).subscribe(data => {
        this.selectedArea = data;
      });
    }
  }

  cerrarModal() {
    this.selectedArea = null;
  }

}