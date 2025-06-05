const es = {
  translation: {
    common: {
      welcome: "Bienvenido",
      submit: "Enviar",
      cancel: "Cancelar",
      yes: "Sí",
      no: "No",
      next: "Siguiente",
      prev: "Anterior",
    },
    referralStep: {
      step1: "Tu Información",
      step2: "Código de Referido",
      step3: "Verificar Código",
      title: "¡Gana un Nissan Versa 2025!",
      proccesing: "Procesando tu registro...",
    },
    login: {
      title: "Inicia sesión con tu teléfono",
      phoneLabel: "Número de teléfono",
      sendOtp: "Enviar OTP",
      enterOtp: "Ingresa el código OTP enviado a",
      verifyOtp: "Verificar OTP",
      changePhone: "Cambiar número",
      errorInvalidPhone: "Número no registrado",
      errorInvalidOtp: "OTP inválido",
      loading: "Cargando...",
    },
    form: {
      firstName: "Nombre",
      lastName: "Apellido",
      phone: "Teléfono",
      email: "Correo electrónico",
      zip: "Código postal",
      referralCode: "Código de referido",
      supermarket: "Supermercado",
      errors: {
        firstName: {
          required: "El nombre es obligatorio",
          max: "El nombre debe tener menos de 50 caracteres",
        },
        lastName: {
          required: "El apellido es obligatorio",
          max: "El apellido debe tener menos de 50 caracteres",
        },
        phone: "El número de teléfono debe tener el formato (123) 456-7890",
        email: "Ingresa un correo electrónico válido",
        zip: "El código postal debe tener 5 dígitos",
        otp: "El código OTP debe tener exactamente 6 dígitos",
      },
    },
    profile: {
      title: "Tu perfil",
      coupons: "Tus participaciones",
      referralLink: "Tu enlace de referido",
      referralCode: "Tu código de referido",
      copyLink: "Copiar enlace",
      copyCode: "Copiar código",
      registeredFriends: "Amigos registrados con tu link",
      noReferrals:
        "Aún no tienes referidos registrados. ¡Comparte tu link para sumar más oportunidades!",
      selectStore: "Selecciona tienda",
      shareWhatsapp: "Compartir por WhatsApp",
      shareFacebook: "Compartir en Facebook",
      share: "Compartir",
      mainReferralLink: "Enlace de referido",
      copySuccess: "¡Enlace copiado!",
      codeCopySuccess: "Código copiado al portapapeles",
      inviteMore: "¡Sigue compartiendo y mucha suerte en el sorteo!",
    },
    referral: {
      shareTitle: "¡Invita, comparte y gana!",
      shareDescription:
        "Comparte tu enlace exclusivo y multiplica tus oportunidades.",
      copy: "¡Copia el link y mándalo por WhatsApp, Messenger, Facebook, SMS, donde quieras!",
      referralExtra:
        "Cada amigo que se registre usando tu código te dará un cupón extra. ¡Suerte!",
      errorInvalid: "El código de referido proporcionado no es válido.",
      autoReferenceError:
        "No puedes usar tu propio código de referido para obtener un cupón extra.",
    },
    errors: {
      generic: "Ocurrió un error. Intenta de nuevo.",
      login: "Error al iniciar sesión",
      required: "Campo requerido",
      notFound: "No se encontraron datos",
      loading: "Cargando...",
      duplicate:
        "Este número ya ha participado en las últimas 24 horas. Inténtalo más tarde.",
      notRegistered: "Número no registrado",
      referralDuplicate:
        "Este número ya fue registrado como referido por esta campaña.",
      otp: {
        invalid: "OTP inválido o no verificado",
        expired: "El OTP ha expirado",
        resend: "Puedes intentar de nuevo en",
        resending: "Reenviando...",
        sent: "OTP enviado",
      },
    },
    thankyou: {
      title: "¡Suerte!",
      description:
        "Aumenta tus posibilidades de ganar, comparte con tus amigos y familiares.",
      main: "¡Estoy participando para GANAR un Nissan Versa 2025 en {{storeName}}! 🚗\n\n¡Súmate al sorteo usando este link! Cada amigo que se registre nos dará una oportunidad extra de ganar. 👀👇\n{{referralLink}}",
      registrationCode: "Tu número de participación es:",
      copySuccess: "¡Link copiado!",
      shareMore:
        "¡Copia el link y mándalo por WhatsApp, Facebook, o donde quieras!",
      shareWhatsapp: "Compartir en WhatsApp",
      shareFacebook: "Compartir en Facebook",
      shareX: "Compartir en X (Twitter)",
      shareGmail: "Compartir por Gmail",
      copyLink: "Copiar link",
      copyright: "Todos los derechos reservados.",
    },
    navbar: {
      participate: "Participar",
      login: "Iniciar sesión",
      logout: "Cerrar sesión",
    },
    otp: {
      title: "Verifica tu identidad",
      instruction: "Ingresa el código de 6 dígitos enviado a",
      fallbackPhone: "tu número",
      verified: "¡Código verificado!",
      locked: "Demasiados intentos. Intenta más tarde.",
      attemptsLeft: "{{count}} intentos restantes",
      resendIn: "Puedes intentar de nuevo en",
      resendsLeft: "({{count}} restantes)",
      resending: "Enviando...",
      resend: "Reenviar código",
      notReceived:
        "¿No recibiste el código? Revisa tu número y la carpeta de spam.",
    },
  },
};

export default es;
