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

export function formatDateLATAM(date) {
  const [dia, mes, fecha, anio] = date.split(" ");

  const latamDia = obtenerDiaSemana(dia);
  console.log(latamDia);
}
