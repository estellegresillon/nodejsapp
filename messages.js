success = (result) => {
  return {
    status: "success",
    result,
  };
};

error = (message) => {
  return {
    status: "error",
    result: message,
  };
};

exports.success = success;
exports.error = error;
