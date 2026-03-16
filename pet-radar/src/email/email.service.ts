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

  // Descarga la imagen de Mapbox como Buffer
  private async fetchMapImage(url: string): Promise<Buffer | null> {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const arrayBuffer = await res.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch {
      return null;
    }
  }

  async sendFoundNotification(data: NotifyFoundEmailData): Promise<boolean> {
    const to = envs.MAIL_TO || envs.MAILER_EMAIL;
    if (!envs.MAILER_EMAIL || !envs.MAILER_PASSWORD || !to) {
      console.warn('Correo no enviado: faltan credenciales');
      return false;
    }

    const mapImageBuffer = data.mapImageUrl
      ? await this.fetchMapImage(data.mapImageUrl)
      : null;

  
    const mapHtml = mapImageBuffer
      ? `<img src="cid:mapimage" alt="Mapa" style="max-width:100%;height:auto;" />`
      : data.mapImageUrl
        ? `<p>No se pudo cargar la imagen del mapa.</p>`
        : `<p>Configura MAPBOX_ACCESS_TOKEN en .env para ver el mapa.</p>`;

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

      <h3>Mapa ( 🔴 perdido y 🟢 encontrado)</h3>
      ${mapHtml}
    `;

    const attachments = mapImageBuffer
      ? [
          {
            filename: 'mapa.png',
            content: mapImageBuffer,
            cid: 'mapimage', 
          },
        ]
      : [];

    try {
      await this.transporter.sendMail({
        from: envs.MAILER_EMAIL,
        to,
        subject: `PetRadar – Posible coincidencia: ${data.lostPetName}`,
        html,
        attachments,
      });
      return true;
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      return false;
    }
  }
}