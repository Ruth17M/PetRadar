import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { envs } from '../config/envs';

export interface NotifyFoundEmailData {
  foundSpecies: string;
  foundBreed: string | null;
  foundColor: string;
  foundDescription: string | null;
  finderName: string;
  finderEmail: string;
  finderPhone: string;
  lostPetName: string;
  lostPetAddress: string | null;
  mapImageUrl: string;
}

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: envs.MAILER_SERVICE,
    auth: {
      user: envs.MAILER_EMAIL,
      pass: envs.MAILER_PASSWORD,
    },
  });

  async sendFoundNotification(data: NotifyFoundEmailData): Promise<boolean> {
    const to = envs.MAIL_TO || envs.MAILER_EMAIL;
    if (!envs.MAILER_EMAIL || !envs.MAILER_PASSWORD) {
      console.warn(
        'Correo no enviado: falta MAILER_EMAIL o MAILER_PASSWORD en .env. Asegúrate de que el archivo .env esté dentro de la carpeta pet-radar (junto a package.json).',
      );
      return false;
    }
    if (!to) {
      console.warn('Correo no enviado: configura MAIL_TO o MAILER_EMAIL en .env');
      return false;
    }

    const html = `
      <h2>PetRadar – Posible mascota encontrada</h2>
      <p>Se ha registrado una mascota encontrada que podría coincidir con una reportada como perdida.</p>
      
      <h3>Datos de la mascota encontrada</h3>
      <ul>
        <li><strong>Especie:</strong> ${data.foundSpecies}</li>
        <li><strong>Raza:</strong> ${data.foundBreed ?? 'No indicada'}</li>
        <li><strong>Color:</strong> ${data.foundColor}</li>
        <li><strong>Descripción:</strong> ${data.foundDescription ?? 'Sin descripción'}</li>
      </ul>
      
      <h3>Contacto de quien la encontró</h3>
      <ul>
        <li><strong>Nombre:</strong> ${data.finderName}</li>
        <li><strong>Correo:</strong> ${data.finderEmail}</li>
        <li><strong>Teléfono:</strong> ${data.finderPhone}</li>
      </ul>
      
      <p><strong>Mascota perdida reportada:</strong> ${data.lostPetName}</p>
      <p><strong>Dirección donde se perdió:</strong> ${data.lostPetAddress ?? 'No indicada'}</p>
      
      <h3>Mapa (punto perdido y punto encontrado)</h3>
      ${data.mapImageUrl ? `<img src="${data.mapImageUrl}" alt="Mapa" style="max-width: 100%; height: auto;" />` : '<p>Configura MAPBOX_ACCESS_TOKEN en .env para ver el mapa.</p>'}
    `;

    try {
      await this.transporter.sendMail({
        from: envs.MAILER_EMAIL,
        to,
        subject: `PetRadar – Posible coincidencia: ${data.lostPetName}`,
        html,
      });
      return true;
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      return false;
    }
  }
}
