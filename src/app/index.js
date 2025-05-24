import { writable } from "svelte/store";

export const base_url = "https://snakesystem-web-api-tdam.shuttle.app/api/v1";
export const socket_url = "wss://snakesystem-web-api-tdam.shuttle.app/api/v1";

export const modals = writable({});

export const openModal = (/** @type {any} */ id) => {
  modals.update((prev) => ({ ...prev, [id]: { show: true } }));
};

export const closeModal = (/** @type {any} */ id) => {
  modals.update((prev) => ({ ...prev, [id]: { show: false } }));
};

export async function fetchColumns(tablename) {
  try {
    const response = await fetch(`${base_url}/data/header?tablename=${tablename}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching columns:", error);
  }
}

export function formatCurrency(value) {
    // Konversi nilai ke string, pastikan mempertahankan tanda + atau -
    const sign = value < 0 ? '-' : (value > 0 && value.toString()[0] === '+' ? '+' : '');
    
    // Buang tanda dari nilai untuk pemrosesan lebih lanjut
    const absoluteValue = Math.abs(value);
  
    // Gunakan Intl.NumberFormat untuk memformat nilai
    const formattedValue = new Intl.NumberFormat('id-ID', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(absoluteValue);
  
    // Tambahkan kembali tanda di depan nilai yang diformat
    return sign + formattedValue;
}

export const tableFormatter = (columns) => {

  return columns?.map((column) => {
      const colname = column.field?.toLowerCase();
      switch (colname) {
          case 'autonid':
          case 'tempimportnid':
              return { ...column, visible: false, sortable: false };
          case 'email':
              return { ...column, sortable: false }
          case 'isfinished':
          case 'isrejected':
          case 'isrevised':
              return { ...column, formatter: zeroOnceFormatter }
          case 'price':
              return { ...column, formatter: currencyFormatter }
          case 'receivetime':
          case 'sendtime':
          case 'transactiondate':
              return { ...column, formatter: dateTimeFormatter }
          case 'lastupdate':
              return { ...column, formatter: dateFormatter }
          default:
              return { ...column, formatter: defaultFormatter };
      }
  })
}

const dateFormatter = (value) => {
  if (value) {
    const date = new Date(value);
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `<div class="text-center">
        ${day} ${month} ${year}
    </div>`;
  } else {
    return value;
  }
};

const dateTimeFormatter = (value) => {
  if (value) {
    const date = new Date(value);
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `<div class="text-center">
        ${day} ${month} ${year} ${hours}:${minutes}:${seconds}
    </div>`;
  } else {
    return value;
  }
};

const currencyFormatter = (value) => {

  if (value) {
      
      if(value < 0) {
          return `<div class="text-end text-danger fw-bold">
          ${formatCurrency(value)}
      </div>`
      } else {
          return `<div class="text-end text-success fw-bold">
          ${formatCurrency(value)}
      </div>`
      }
  } else {
      return value
  }
}

const defaultFormatter = (value) => {
  if (value) {
      return `<div class="text-center">${value}</div>`
  }

  return `<div class="text-center">-</div>`
}

function zeroOnceFormatter (value) {
  if (value === 0) {
      return `<div class="text-center"><i class="bi bi-x-circle-fill text-danger"></i></div>`
  }
  return `<div class="text-center"><i class="bi bi-check-circle-fill text-success"></i></div>`
}