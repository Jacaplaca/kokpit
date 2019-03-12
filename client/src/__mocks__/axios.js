const list = [
  {
    id: 1,
    name: "Montaż",
    unit: "dni",
    clientId: 2,
    channelId: 1,
    createdAt: null,
    updatedAt: null
  },
  {
    id: 2,
    name: "Pulsator",
    unit: "szt.",
    clientId: 2,
    channelId: 1,
    createdAt: null,
    updatedAt: null
  },
  {
    id: 3,
    name: "Przegląd",
    unit: "szt.",
    clientId: 2,
    channelId: 1,
    createdAt: null,
    updatedAt: null
  },
  {
    id: 4,
    name: "Serwis naprawa",
    unit: "szt.",
    clientId: 2,
    channelId: 1,
    createdAt: null,
    updatedAt: null
  },
  {
    id: 5,
    name: "EKG",
    unit: "szt.",
    clientId: 2,
    channelId: 1,
    createdAt: null,
    updatedAt: null
  },
  {
    id: 6,
    name: "Łaszczówka",
    unit: "godz.",
    clientId: 2,
    channelId: 1,
    createdAt: null,
    updatedAt: null
  },
  {
    id: 7,
    name: "Inwestycje",
    unit: "szt.",
    clientId: 2,
    channelId: 1,
    createdAt: null,
    updatedAt: null
  },
  {
    id: 8,
    name: "Płyn 25",
    unit: "szt.",
    clientId: 2,
    channelId: 1,
    createdAt: null,
    updatedAt: null
  },
  {
    id: 9,
    name: "Płyn 35",
    unit: "szt.",
    clientId: 2,
    channelId: 1,
    createdAt: null,
    updatedAt: null
  },
  {
    id: 10,
    name: "Płyn 60",
    unit: "szt.",
    clientId: 2,
    channelId: 1,
    createdAt: null,
    updatedAt: null
  },
  {
    id: 11,
    name: "Płyn 240",
    unit: "szt.",
    clientId: 2,
    channelId: 1,
    createdAt: null,
    updatedAt: null
  },
  {
    id: 12,
    name: "Dipping 5",
    unit: "szt.",
    clientId: 2,
    channelId: 1,
    createdAt: null,
    updatedAt: null
  },
  {
    id: 13,
    name: "Dipping 10",
    unit: "szt.",
    clientId: 2,
    channelId: 1,
    createdAt: null,
    updatedAt: null
  },
  {
    id: 14,
    name: "Dipping 20",
    unit: "szt.",
    clientId: 2,
    channelId: 1,
    createdAt: null,
    updatedAt: null
  },
  {
    id: 15,
    name: "Dipping 60",
    unit: "szt.",
    clientId: 2,
    channelId: 1,
    createdAt: null,
    updatedAt: null
  }
];

export default {
  get: jest.fn(url => {
    // console.log("pyutanie", url);
    if (url === "/api/current_user") {
      return Promise.resolve({
        data: {
          user_id: 14,
          clientId: 2,
          email: "user@swiadomafirma.pl",
          role: "pracownik",
          costs: 1,
          planer: 1,
          raporty: 1,
          nextReports: 1,
          serwis: 1,
          channel_first: 1,
          chanprodconf: 1
        }
      });
    } else {
      return Promise.resolve({
        data: list
      });
    }
  })
};
