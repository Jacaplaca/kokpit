export const elements = role => [
  {
    comp: "powerBi",
    text: "Power BI",
    link: "https://powerbi.microsoft.com/pl-pl/",
    icon: "Pageview"
  },
  {
    comp: "nextReports",
    text: "Next Reports",
    link: "/nextreports",
    icon: "InsertChartOutlined"
  },
  {
    text: "Planer",
    icon: "EventIcon",
    comp: "planer_reports",
    menus: [
      // {
      //   comp: "nextReports",
      //   text: "Next Reports",
      //   link: "/nextreports",
      //   icon: "InsertChartOutlined"
      // }
      {
        // comp: "planer",
        text: role && role === "master" ? "Aktywności" : "Zaplanuj aktywności",
        link: "/planer",
        icon: "EventIcon"
      },
      {
        // comp: "raporty",
        text: "Raporty",
        link: "/raporty",
        icon: "EventAvailableIcon"
      }
    ]
  },
  { comp: "costs", text: "Koszty", link: "/costs", icon: "MoneyIcon" },
  {
    comp: "invoices",
    text: "Faktury",
    link: "/invoices",
    icon: "ListAlt"
  },
  {
    comp: "customer_details",
    text: "Informacje o klientach",
    link: "/customerdetails",
    icon: "People"
  },
  {
    comp: "calculators",
    text: "Kalkulator premiowy",
    link: "/calculators",
    icon: "Money"
  },
  {
    comp: "bonusRules",
    text: "Regulamin premiowy",
    link: "/bonusrules",
    icon: "Description"
  },
  {
    text: "Konfiguracja",
    comp: "settings",
    icon: "Settings",
    // link: "/costs",
    comps: [
      {
        comp: "bonus_system",
        // icon: "Assignment",
        text: "Ustawienia premii",
        menus: [
          {
            // comp: "products",
            text: "Produkty",
            link: "/products",
            icon: "LocalOffer"
          },
          {
            // comp: "channels",
            text: "Systemy prowizyjne",
            link: "/systems",
            icon: "Assignment"
          },
          {
            // comp: "users_channels",
            text: "Pracownicy",
            link: "/users_channels",
            icon: "People"
          }
        ]
      },
      {
        comp: "users",
        text: "Użytkownicy",
        link: "/users",
        icon: "Person"
      },
      {
        comp: "settings",
        text: "Ogólne ustawienia",
        link: "/settings",
        icon: "Settings"
      }
    ]
  }
];
