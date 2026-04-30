import { generateHash, generateBlockHash, generateBookingId } from "@/lib/blockchain";

const STORAGE_KEYS = {
  BOOKINGS: 'gaschain_mock_bookings_v2',
  BLOCKS: 'gaschain_mock_blocks_v2',
  SUBSIDIES: 'gaschain_mock_subsidies_v2'
};

const getStorage = (key, defaultValue = []) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

const setStorage = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const mockData = {
  bookings: {
    list: () => getStorage(STORAGE_KEYS.BOOKINGS),
    create: (data) => {
      const bookings = getStorage(STORAGE_KEYS.BOOKINGS);
      const newBooking = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
      };
      bookings.unshift(newBooking);
      setStorage(STORAGE_KEYS.BOOKINGS, bookings);
      return newBooking;
    },
    update: (id, updates) => {
      const bookings = getStorage(STORAGE_KEYS.BOOKINGS);
      const index = bookings.findIndex(b => b.id === id);
      if (index !== -1) {
        bookings[index] = { ...bookings[index], ...updates, updated_date: new Date().toISOString() };
        setStorage(STORAGE_KEYS.BOOKINGS, bookings);
        return bookings[index];
      }
      return null;
    },
    filter: (query) => {
      const bookings = getStorage(STORAGE_KEYS.BOOKINGS);
      return bookings.filter(b => Object.entries(query).every(([k, v]) => b[k] === v));
    }
  },
  blocks: {
    list: () => getStorage(STORAGE_KEYS.BLOCKS),
    create: (data) => {
      const blocks = getStorage(STORAGE_KEYS.BLOCKS);
      const newBlock = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        created_date: new Date().toISOString(),
      };
      blocks.unshift(newBlock);
      setStorage(STORAGE_KEYS.BLOCKS, blocks);
      return newBlock;
    },
    filter: (query) => {
      const blocks = getStorage(STORAGE_KEYS.BLOCKS);
      return blocks.filter(b => Object.entries(query).every(([k, v]) => b[k] === v));
    }
  },
  subsidies: {
    list: () => getStorage(STORAGE_KEYS.SUBSIDIES),
    create: (data) => {
      const subsidies = getStorage(STORAGE_KEYS.SUBSIDIES);
      const newSubsidy = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        created_date: new Date().toISOString(),
      };
      subsidies.unshift(newSubsidy);
      setStorage(STORAGE_KEYS.SUBSIDIES, subsidies);
      return newSubsidy;
    }
  },
  initialize: () => {
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) setStorage(STORAGE_KEYS.BOOKINGS, []);
    if (!localStorage.getItem(STORAGE_KEYS.BLOCKS)) setStorage(STORAGE_KEYS.BLOCKS, []);
    if (!localStorage.getItem(STORAGE_KEYS.SUBSIDIES)) setStorage(STORAGE_KEYS.SUBSIDIES, []);
  }
};

