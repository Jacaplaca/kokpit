export const elements = auth => {
  const elementsStandard = [
    {
      comp: "powerBi",
      text: "Power BI",
      text_en: "Power BI",
      link: "https://powerbi.microsoft.com/pl-pl/",
      icon: "Pageview",
      links: []
    },
    {
      comp: "nextReports",
      text: "Next Reports",
      text_en: "Next Reports",
      link: "/nextreports",
      icon: "InsertChartOutlined",
      links: ["/nextreports"]
    },
    {
      text: "Planer",
      text_en: "Planner",
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
          text: "Aktywności",
          text_en: "Activities",
          link: "/planer",
          icon: "EventIcon"
        },
        {
          // comp: "raporty",
          text: "Raporty",
          text_en: "Reports",
          link: "/raporty",
          icon: "EventAvailableIcon"
        }
      ]
    },
    {
      comp: "costs",
      text: "Koszty",
      text_en: "Costs",
      link: "/costs",
      icon: "MoneyIcon",
      links: ["/costs"]
    },
    {
      comp: "invoices",
      text: "Faktury",
      text_en: "Invoices",
      link: "/invoices",
      icon: "ListAlt",
      links: ["/invoices"]
    },
    {
      comp: "customer_details",
      text: "Informacje o klientach",
      text_en: "Customer details",
      link: "/customerdetails",
      icon: "People",
      links: ["/customerdetails"]
    },
    {
      comp: "calculators",
      text: "Kalkulator premiowy",
      text_en: "Bonus calculator",
      link: "/calculators",
      icon: "Money",
      links: ["/calculators"]
    },
    {
      comp: "documents_transactions",
      text: "Transakcje z dokumentów",
      text_en: "Documents transactions",
      link: "/documentstransactions",
      icon: "Inbox",
      links: ["/documentstransactions"]
    },
    {
      comp: "bonusRules",
      text: "Pliki do pobrania",
      text_en: "Files",
      link: "/bonusrules",
      icon: "Description",
      links: ["/bonusrules"]
    }
  ];

  const elementsKonfig = [
    {
      text: "Konfiguracja",
      text_en: "Settings",
      comp: "settings",
      icon: "Settings",
      links: [
        "/products",
        "/systems",
        "/users_channels",
        "/users",
        "/settings"
      ],
      // link: "/costs",
      comps: [
        {
          comp: "bonus_system",
          // icon: "Assignment",
          text: "Ustawienia premii",
          text_en: "Bonus settings",
          menus: [
            {
              // comp: "products",
              text: "Produkty",
              text_en: "Items",
              link: "/products",
              icon: "LocalOffer"
            },
            {
              // comp: "channels",
              text: "Systemy prowizyjne",
              text_en: "Bonus systems",
              link: "/systems",
              icon: "Assignment"
            },
            {
              // comp: "users_channels",
              text: "Pracownicy",
              text_en: "Employees",
              link: "/users_channels",
              icon: "People"
            }
          ]
        },
        {
          comp: "users",
          text: "Użytkownicy",
          text_en: "Users",
          link: "/users",
          icon: "Person",
          links: ["/users"]
        },
        {
          comp: "settings",
          text: "Ogólne ustawienia",
          text_en: "Settings",
          link: "/settings",
          icon: "Settings",
          links: ["/settings"]
        }
      ]
    }
  ];

  let elements = elementsStandard;
  elements =
    auth && auth.id === 93
      ? elementsStandard
      : // : Object.assign(elementsStandard, elementsKonfig);
        [...elementsStandard, ...elementsKonfig];
  return elements;
  // return [];
};
