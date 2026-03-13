import { FoundPetCDto } from "src/core/interfaces/found-pet.interface";
import { generateMapBoxImage } from "src/core/utils/utils";
import { PetSpecies } from "src/core/enums/pet-species.enum";
import { PetSize } from "src/core/enums/pet-size.enum";

const speciesLabels: Record<PetSpecies, { label: string; color: string }> = {
    [PetSpecies.DOG]: { label: "Perro", color: "#10B981" },
    [PetSpecies.CAT]: { label: "Gato", color: "#6366F1" },
    [PetSpecies.BIRD]: { label: "Ave", color: "#06B6D4" },
    [PetSpecies.OTHER]: { label: "Otro", color: "#6B7280" },
};

const sizeLabels: Record<PetSize, string> = {
    [PetSize.SMALL]: "Pequeño",
    [PetSize.MEDIUM]: "Mediano",
    [PetSize.LARGE]: "Grande",
};

export const generateFoundPetEmailTemplate = (foundPet: FoundPetCDto): string => {
    const imageUrl = generateMapBoxImage(foundPet.lat, foundPet.lon);
    const speciesInfo = speciesLabels[foundPet.species] ?? { label: "Desconocido", color: "#6B7280" };
    const sizeLabel = sizeLabels[foundPet.size] ?? "No especificado";
    const date = new Date().toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f0f2f5;font-family:'Segoe UI',Roboto,Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f5;padding:32px 0;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

                        <!-- Header -->
                        <tr>
                            <td style="background:linear-gradient(135deg,${speciesInfo.color},${speciesInfo.color}cc);padding:32px 40px;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td>
                                            <span style="display:inline-block;background-color:rgba(255,255,255,0.2);color:#ffffff;font-size:12px;font-weight:600;padding:4px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:1px;">
                                                Mascota encontrada
                                            </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top:16px;">
                                            <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;line-height:1.3;">
                                                Reporte de mascota encontrada
                                            </h1>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top:8px;">
                                            <span style="display:inline-block;background-color:#ffffff;color:${speciesInfo.color};font-size:13px;font-weight:700;padding:6px 16px;border-radius:20px;">
                                                ${speciesInfo.label}
                                            </span>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Pet Info -->
                        <tr>
                            <td style="padding:32px 40px 0;">
                                <h2 style="margin:0 0 16px;font-size:14px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">
                                    Datos de la mascota
                                </h2>

                                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f9fb;border-radius:12px;overflow:hidden;">
                                    <tr>
                                        <td style="padding:20px 24px;">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td width="50%" style="padding-bottom:12px;">
                                                        <span style="font-size:12px;color:#9ca3af;font-weight:500;">Especie</span><br/>
                                                        <span style="font-size:15px;color:#1f2937;font-weight:600;">${speciesInfo.label}</span>
                                                    </td>
                                                    <td width="50%" style="padding-bottom:12px;">
                                                        <span style="font-size:12px;color:#9ca3af;font-weight:500;">Tamaño</span><br/>
                                                        <span style="font-size:15px;color:#1f2937;font-weight:600;">${sizeLabel}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="50%" style="padding-bottom:12px;">
                                                        <span style="font-size:12px;color:#9ca3af;font-weight:500;">Raza</span><br/>
                                                        <span style="font-size:15px;color:#1f2937;font-weight:600;">${foundPet.breed ?? "No identificada"}</span>
                                                    </td>
                                                    <td width="50%" style="padding-bottom:12px;">
                                                        <span style="font-size:12px;color:#9ca3af;font-weight:500;">Color</span><br/>
                                                        <span style="font-size:15px;color:#1f2937;font-weight:600;">${foundPet.color}</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Description -->
                        <tr>
                            <td style="padding:24px 40px 0;">
                                <h2 style="margin:0 0 12px;font-size:14px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">
                                    Descripción
                                </h2>
                                <p style="margin:0;font-size:16px;color:#1f2937;line-height:1.6;">
                                    ${foundPet.description}
                                </p>
                            </td>
                        </tr>

                        <!-- Finder Info -->
                        <tr>
                            <td style="padding:24px 40px 0;">
                                <h2 style="margin:0 0 16px;font-size:14px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">
                                    Datos de contacto
                                </h2>

                                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f9fb;border-radius:12px;overflow:hidden;">
                                    <tr>
                                        <td style="padding:20px 24px;">
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td width="50%" style="padding-bottom:12px;">
                                                        <span style="font-size:12px;color:#9ca3af;font-weight:500;">Nombre de quien la encontró</span><br/>
                                                        <span style="font-size:15px;color:#1f2937;font-weight:600;">${foundPet.finderName}</span>
                                                    </td>
                                                    <td width="50%" style="padding-bottom:12px;">
                                                        <span style="font-size:12px;color:#9ca3af;font-weight:500;">Teléfono</span><br/>
                                                        <span style="font-size:15px;color:#1f2937;font-weight:600;">${foundPet.finderPhone}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2">
                                                        <span style="font-size:12px;color:#9ca3af;font-weight:500;">Correo electrónico</span><br/>
                                                        <span style="font-size:15px;color:#1f2937;font-weight:600;">${foundPet.finderEmail}</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Location Info -->
                        <tr>
                            <td style="padding:24px 40px 0;">
                                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f9fb;border-radius:12px;overflow:hidden;">
                                    <tr>
                                        <td style="padding:20px 24px;">
                                            <h2 style="margin:0 0 16px;font-size:14px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">
                                                Ubicación del reporte
                                            </h2>
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td width="50%" style="padding-bottom:8px;">
                                                        <span style="font-size:12px;color:#9ca3af;font-weight:500;">Latitud</span><br/>
                                                        <span style="font-size:15px;color:#1f2937;font-weight:600;">${foundPet.lat}</span>
                                                    </td>
                                                    <td width="50%" style="padding-bottom:8px;">
                                                        <span style="font-size:12px;color:#9ca3af;font-weight:500;">Longitud</span><br/>
                                                        <span style="font-size:15px;color:#1f2937;font-weight:600;">${foundPet.lon}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2" style="padding-top:8px;">
                                                        <span style="font-size:12px;color:#9ca3af;font-weight:500;">Dirección aproximada</span><br/>
                                                        <span style="font-size:15px;color:#1f2937;font-weight:600;">${foundPet.address}</span>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Map Image -->
                        <tr>
                            <td style="padding:24px 40px;">
                                <img src="${imageUrl}" width="520" style="width:100%;border-radius:12px;display:block;" alt="Mapa de ubicación"/>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="padding:0 40px 32px;">
                                <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e7eb;padding-top:20px;">
                                    <tr>
                                        <td>
                                            <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.5;">
                                                Reporte generado el ${date}
                                            </p>
                                            <p style="margin:4px 0 0;font-size:12px;color:#9ca3af;">
                                                Pets Radar
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};