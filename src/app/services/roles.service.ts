import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, increment, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Rol } from '../interfaces/rol';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private firestore = inject(Firestore);
  rolesCollection = collection(this.firestore, 'roles');

  getRoles(): Observable<Rol[]> {
    return collectionData(this.rolesCollection, { idField: 'id' }) as Observable<Rol[]>;
  }

  addRol(rol: Rol) {
    return addDoc(this.rolesCollection, rol);
  }

  updateRol(id: string, rol: Partial<Rol>) {
    const rolDoc = doc(this.firestore, `roles/${id}`);
    return updateDoc(rolDoc, rol);
  }

  deleteRol(id: string) {
    const rolDoc = doc(this.firestore, `roles/${id}`);
    return deleteDoc(rolDoc);
  }

  changeRolUserCounter(id: string, change: number) {
    const rolDoc = doc(this.firestore, `roles/${id}`);
    return updateDoc(rolDoc, {
      usuarios: increment(change),
    });
  }
}