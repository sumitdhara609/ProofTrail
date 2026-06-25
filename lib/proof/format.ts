export function formatStatus(status: string) {
  return status
    .split("_")
    .map((part) => capitalize(part))
    .join(" ");
}

export function formatEvidenceType(type: string) {
  return type
    .split("_")
    .map((part) => capitalize(part))
    .join(" ");
}

export function formatDate(value: string | null) {
  if (!value) {
    return "Not dated";
  }

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(value: string | null) {
  if (!value) {
    return "Not available";
  }

  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function capitalize(value: string) {
  if (!value) {
    return "";
  }

  return value[0].toUpperCase() + value.slice(1);
}