export default {
  auth: {
    register: "/api/auth/register",
    login: "api/auth/login",
    logout: "/api/auth/logout",
    refreshToken: "/api/auth/refresh",
  },
  user: {
    current: "/api/user/current",
    all: "/api/user/all",
    delete: (id: string | number) => `/api/user/${id}`,
    activate: (id: string | number) => `/api/user/${id}/activate`,
    deactivate: (id: string | number) => `/api/user/${id}/deactivate`,
    assignRole: (id: string | number) => `/api/user/${id}/assignRole`,
    removeRole: (id: string | number) => `/api/user/${id}/removeRole`,
  },
  badges: {
    all: "/api/badges/all",
    won: "/api/badges/won",
    notWon: "/api/badges/notWon",
    edit: (id?: string) => `/api/badges/edit/${id || ""}`,
    recent: (id?: string) => `/api/badges/recent/${id || ""}`,
    create: {
      country: "/api/badges/create/country",
      city: "/api/badges/create/city",
    },
  },
  locations: {
    get: (id?: string | number) => `/api/locations/${id || ""}`,
    create: "/api/locations/",
    update: (id?: string | number) => `/api/locations/${id || ""}`,
    visited: "/api/locations/visited",
    approved: "/api/locations/approved",
    suggestions: "/api/locations/suggestions",
    cities: {
      get: "/api/locations/cities",
      find: "/api/locations/cities/find",
    },
    delete: (id?: string | number) => `/api/locations/${id || ""}`,
  },
  countries: {
    visited: "/api/countries/visited",
    whitelisted: {
      get: "/api/countries/whitelisted",
      notVisited: "/api/countries/whitelisted/notVisited",
    },
  },
  userProfile: {
    get: (id?: string | number) => `/api/userProfile/${id || ""}`,
    edit: "/api/userProfile/edit",
    getPicture: (id?: number | string) => `/api/userProfile/${id || ""}/picture`,
    addFriend: (id: number | string) => `/api/userProfile/${id}/addFriend`,
    sentRequests: "/api/userProfile/requests/sent",
    all: "/api/userProfile/all",
  },
  wishlistEntry: {
    get: "/api/wishlist",
    post: "/api/wishlist",
    delete: (id: string | number) => `/api/wishlist/${id}`,
  },
  trips: {
    post: "/api/trips",
    recent: (requestedUserId: string | number) => `/api/user/${requestedUserId}/trips/recent`,
    like: (id: string | number) => `/api/trips/${id}/like`,
    unlike: (id: string | number) => `/api/trips/${id}/unlike`,
    social: "/api/trips/social",
  },
};
