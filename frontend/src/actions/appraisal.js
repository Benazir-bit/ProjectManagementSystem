import axios from "axios";
import {
  GET_APPRAISAL,
  GET_APPRAISAL_VALID,
  GET_APPRAISAL_VIEW,
  GET_APPRAISALCYCLE_LIST,
  GET_APPRAISAL_FORMSLIST,
  GET_APPRAISALLIST,
  GET_APPRAISAL_FORREVIEWS,
  ERROR_FORBIDDEN,
  GET_RESPONSE
} from "./types";
import { tokenConfig } from "./auth";
import { createMessage } from "./alerts";
export const xltokenConfig = getState => {
  //GET TOKEN FROM STATE
  const token = getState().auth.token;

  let config = {
    responseType: "blob",
    headers: {
      Authorization: `Token ${token}`
    }
  };

  return config;
};
// new

export const genExcel = cycle_id => (dispatch, getState) => {
  axios
    .get(
      `/appraisal/generate/xlr-file/?cycle_id=${cycle_id}`,
      xltokenConfig(getState)
    )
    .then(response => {
      console.log(response);
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/vnd.ms-excel" })
      );
      const link = document.createElement("a");

      link.href = url;
      const filename = response.headers["content-disposition"];
      console.log(filename.split(";")[1]);
      const name = filename.split(";")[1];
      link.setAttribute("download", `${name.split("=")[1]}.xlsx`);
      document.body.appendChild(link);
      link.click();
    })
    .catch(err => {
      console.log(err);
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};
export const getAppraisalForwardList = (type, filter) => (
  dispatch,
  getState
) => {
  axios
    .get(
      `/appraisal/api/appraisalforwardlist/?type=${type}&&filter=${filter}`,
      tokenConfig(getState)
    )
    .then(res => {
      //console.log(res.data, "kkkkkkk");
      dispatch({
        type: GET_APPRAISAL_FORREVIEWS,
        payload: res.data
      });

      //dispatch(createMessage("Succesfully Sent Appraisal", "success"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};

export const getUserAppraisals = type => (dispatch, getState) => {
  dispatch({
    type: GET_APPRAISAL_FORMSLIST,
    payload: null
  });
  axios
    .get(`/appraisal/api/appraisallist/?type=${type}`, tokenConfig(getState))
    .then(res => {
      //console.log(res.data);
      dispatch({
        type: GET_APPRAISAL_FORMSLIST,
        payload: res.data
      });
      //dispatch(createMessage("Succesfully Sent Appraisal", "success"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};
export const deleteAppraisalCycle = id => (dispatch, getState) => {
  axios
    .delete(`/appraisal/api/appraisalcycle/?id=${id}`, tokenConfig(getState))
    .then(res => {
      //console.log(res.data);
      dispatch(getAppraisalCycleList("all"));
      dispatch(createMessage("Succesfully Deleted", "success"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};
export const getAppraisalCycleList = type => (dispatch, getState) => {
  axios
    .get(`/appraisal/api/appraisalcycle/?type=${type}`, tokenConfig(getState))
    .then(res => {
      //console.log(res.data);
      dispatch({
        type: GET_APPRAISALCYCLE_LIST,
        payload: res.data
      });
      //dispatch(createMessage("Succesfully Sent Appraisal", "success"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};

export const getValidation = body => (dispatch, getState) => {
  axios
    .get(
      `/appraisal/api/appraisalvalidation/?created_for=${body.created_for}`,
      tokenConfig(getState)
    )
    .then(res => {
      //console.log(res.data);
      dispatch({
        type: GET_APPRAISAL_VALID,
        payload: res.data
      });
      //dispatch(createMessage("Succesfully Sent Appraisal", "success"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};

export const addAppraisalCycle = body => (dispatch, getState) => {
  axios
    .post(`/appraisal/api/appraisalcycle/`, body, tokenConfig(getState))
    .then(res => {
      dispatch(createMessage("Succesfully Add Appraisal Cycle", "success"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};
export const postAppraisal = body => (dispatch, getState) => {
  axios
    .post(`/appraisal/api/appraisal/`, body, tokenConfig(getState))
    .then(res => {
      // dispatch({
      //   type: GET_APPRAISAL,
      //   payload: res.data
      // });
      dispatch(getAppraisal(res.data.id));
      dispatch(createMessage("Succesfully Sent Appraisal", "success"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};
export const updateAppraisal = body => (dispatch, getState) => {
  axios
    .put(`/appraisal/api/appraisal/`, body, tokenConfig(getState))
    .then(res => {
      // dispatch({
      //   type: GET_APPRAISAL,
      //   payload: res.data
      // });
      dispatch(getAppraisal(res.data.id));
      dispatch(createMessage("Succesfully Sent Appraisal Review", "success"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};
export const getAppraisalList = (type, id) => (dispatch, getState) => {
  dispatch({
    type: GET_APPRAISALLIST,
    payload: null
  });
  axios
    .get(
      `/appraisal/api/appraisallist/?type=${type}&&cycle_id=${id}`,
      tokenConfig(getState)
    )
    .then(res => {
      //console.log(res.data);
      dispatch({
        type: GET_APPRAISALLIST,
        payload: res.data
      });
    })
    .catch(err => {
      //console.log(err.response);
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          dispatch(
            createMessage(
              `${err.response.status} ${err.response.statusText}`,
              "error"
            )
          )
        );
      }
    });
};
export const getAppraisal = id => (dispatch, getState) => {
  dispatch({
    type: ERROR_FORBIDDEN,
    payload: false
  });
  dispatch({
    type: GET_APPRAISAL_VIEW,
    payload: null
  });
  axios
    .get(`/appraisal/api/appraisal/${id}`, tokenConfig(getState))
    .then(res => {
      //console.log(res.data, "aaaaaaaaaaaaaaaaaaaaaa");
      dispatch({
        type: GET_APPRAISAL_VIEW,
        payload: res.data
      });
    })
    .catch(err => {
      //console.log(err.response);
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        if (err.response.statusText == "Forbidden") {
          dispatch({
            type: ERROR_FORBIDDEN,
            payload: true
          });
        } else {
          dispatch(
            createMessage(
              `${err.response.status} ${err.response.statusText}`,
              "error"
            )
          );
        }
      }
    });
};
export const getPdfFile = id => (dispatch, getState) => {
  dispatch({
    type: GET_RESPONSE,
    payload: true
  });
  axios
    .get(`/appraisal/generate/pdf-file/?id=${id}`, xltokenConfig(getState))
    .then(response => {
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");

      link.href = url;
      const filename = response.headers["content-disposition"];
      link.setAttribute("download", `${filename.split("=")[1]}.pdf`);
      document.body.appendChild(link);
      link.click();
      dispatch({
        type: GET_RESPONSE,
        payload: false
      });
    })
    .catch(err => {
      //console.log(err.response);
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      }
    });
};
export const draftAppraisal = body => (dispatch, getState) => {
  axios
    .put(`/appraisal/api/appraisal/`, body, tokenConfig(getState))
    .then(res => {
      //console.log(res.data);
      dispatch(createMessage("Appraisal Saved to Draft", "success"));
    })
    .catch(err => {
      //console.log(err.response);
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          dispatch(
            createMessage(
              `${err.response.status} ${err.response.statusText}`,
              "error"
            )
          )
        );
      }
    });
};
