import React from "react";
import { combineReducers } from "redux";
import auth from "./auth";
import profile from "./profile";
import group from "./group";
import projects from "./projects";
import taskoverview from "./taskoverview";
import tasks from "./tasks";
import issues from "./issues";
import kpi from "./kpi";
import alerts from "./alerts";
import member from "./member";
import modal from "./modal";
import search from "./search";
import notice from "./notice";
import news from "./news";
import HR from "./HR";
import notifications from "./notifications";
import chat from "./chat";
import loading from "./loading";
import groupSelect from "./groupSelect";
import infinityScroll from "./infinityScroll";
import weeklyReport from "./weeklyReport";
import projectSummary from "./projectSummary";
import template from "./template";
import heirarchy from "./heirarchy";
export default combineReducers({
  auth,
  profile,
  group,
  projects,
  taskoverview,
  tasks,
  issues,
  kpi,
  alerts,
  member,
  modal,
  search,
  news,
  notice,
  HR,
  notifications,
  chat,
  loading,
  groupSelect,
  infinityScroll,
  weeklyReport,
  projectSummary,
  heirarchy,
  template
});
