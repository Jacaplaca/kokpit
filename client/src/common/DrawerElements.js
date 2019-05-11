export const elements = role => [
  {
    comp: "powerBi",
    text: "Power BI",
    link: "https://powerbi.microsoft.com/pl-pl/",
    icon: "Pageview",
    links: []
  },
  {
    comp: "nextReports",
    text: "Next Reports",
    link: "/nextreports",
    icon: "InsertChartOutlined",
    links: ["/nextreports"]
  },
  {
    text: "Planer",
    icon: "EventIcon",
    comp: "planer_reports",
    links: ["/planer", "/raporty"],
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
  {
    comp: "costs",
    text: "Koszty",
    link: "/costs",
    icon: "MoneyIcon",
    links: ["/costs"]
  },
  {
    comp: "invoices",
    text: "Faktury",
    link: "/invoices",
    icon: "ListAlt",
    links: ["/invoices"]
  },
  {
    comp: "customer_details",
    text: "Informacje o klientach",
    link: "/customerdetails",
    icon: "People",
    links: ["/customerdetails"]
  },
  {
    comp: "calculators",
    text: "Kalkulator premiowy",
    link: "/calculators",
    icon: "Money",
    links: ["/calculators"]
  },
  {
    comp: "bonusRules",
    text: "Regulamin premiowy",
    link: "/bonusrules",
    icon: "Description",
    links: ["/bonusrules"]
  },
  {
    text: "Konfiguracja",
    comp: "settings",
    icon: "Settings",
    links: ["/products", "/systems", "/users_channels", "/users", "/settings"],
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
        icon: "Person",
        links: ["/users"]
      },
      {
        comp: "settings",
        text: "Ogólne ustawienia",
        link: "/settings",
        icon: "Settings",
        links: ["/settings"]
      }
    ]
  }
];
