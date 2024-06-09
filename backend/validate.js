const validate = (payload) => {
    const errors = {};
    if (!payload.email) {
      errors.email = "*Field is required";
    }
    else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(payload.email)
    ) {
      errors.email = "*Email should contain @,.";
    } else if (!["gmail.com"].includes(payload.email.split("@")[1])) {
      errors.email = "*Invalid email subdomain";
    }
    else if (!/^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.[A-Za-z]{2,3}$/.test(payload.email)) {
      errors.email = "*Invalid email format";
    }
    if (!payload.password) {
      errors.password = "*Field is required";
    }
    return errors;
  };
  module.exports= {validate};