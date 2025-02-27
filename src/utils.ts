import logger from "./logger.js";

function obtenerDiaSemana(abreviatura) {
  switch (abreviatura.toLowerCase()) {
    case "mon":
      return "Lunes";
    case "tues":
    case "tue":
      return "Martes";
    case "wed":
      return "Miércoles";
    case "thu":
      return "Jueves";
    case "fri":
      return "Viernes";
    default:
      return "Abreviatura no válida";
  }
}

function obtenerMes(abreviatura) {
  switch (abreviatura.toLowerCase()) {
    case "jan":
      return "Enero";
    case "feb":
    case "febr":
      return "Febrero";
    case "mar":
    case "march":
      return "Marzo";
    case "apr":
      return "Abril";
    case "may":
      return "Mayo";
    case "jun":
      return "Junio";
    case "jul":
      return "Julio";
    case "aug":
      return "Agosto";
    case "sep":
      return "Septiembre";
    case "oct":
      return "Octubre";
    case "nov":
      return "Noviembre";
    case "dec":
      return "Diciembre";
    default:
      return "Abreviatura no válida";
  }
}

export function formatDateLATAM(date) {
  const [dia, mes, fecha, anio] = date.split(" ");

  const latamDia = obtenerDiaSemana(dia);
  const latamMes = obtenerMes(mes);
  logger.info(
    `La ultima fecha abierta para Pasaportes fue el ${latamDia}, ${fecha} de ${latamMes} del ${anio}.`
  );
}
