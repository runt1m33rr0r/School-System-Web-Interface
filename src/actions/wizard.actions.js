import { makeRequest } from '../api';
import * as types from '../constants/wizard.types';
import { CHECK_SETUP_SUCCESS } from '../constants/system.types';
import ENDPOINT from '../constants/api.constants';

export const setSchoolType = type => ({
  type: types.SET_SCHOOL_TYPE,
  schoolType: type,
});

export const setGroupsCount = count => ({
  type: types.SET_GROUPS_COUNT,
  count,
});

export const addSubject = subjectName => ({
  type: types.ADD_SUBJECT,
  subjectName,
});

export const removeSubject = subjectName => ({
  type: types.REMOVE_SUBJECT,
  subjectName,
});

export const addTimeslot = timeslot => ({
  type: types.ADD_TIMESLOT,
  timeslot,
});

export const removeTimeslot = timeslot => ({
  type: types.REMOVE_TIMESLOT,
  timeslot,
});

export const generateGroups = (schoolType, groupsCount) => (dispatch) => {
  dispatch({ type: types.GENERATE_GROUPS_STARTED });

  const groups = {};
  const groupNames = [];
  const letters = ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ж', 'З', 'И'];
  const startGrade = schoolType === 'gymnasium' ? 8 : 1;
  const endGrade = schoolType === 'gymnasium' ? 12 : 7;

  for (let grade = startGrade; grade <= endGrade; grade += 1) {
    for (let groupIdx = 1; groupIdx <= groupsCount && groupIdx < letters.length; groupIdx += 1) {
      const name = `${grade}${letters[groupIdx - 1]}`;
      groups[name] = [];
      groupNames.push(name);
    }
  }

  dispatch({
    type: types.GENERATE_GROUPS_FINISHED,
    groups,
    groupNames,
  });
};

export const addSubjectToGroup = (groupName, subjectName) => ({
  type: types.ADD_SUBJECT_TO_GROUP,
  groupName,
  subjectName,
});

export const removeSubjectFromGroup = (groupName, subjectName) => ({
  type: types.REMOVE_SUBJECT_FROM_GROUP,
  groupName,
  subjectName,
});

const processTimeslots = (timeslots) => {
  const days = {
    Понеделник: 1,
    Вторник: 2,
    Сряда: 3,
    Четвъртък: 4,
    Петък: 5,
    Събота: 6,
    Неделя: 7,
  };

  const result = [];
  timeslots.forEach((timeslot) => {
    const words = timeslot.split(' ');
    const day = days[words[0]];
    const from = words[2];
    const fromNums = from.split(':');
    const fromHour = parseInt(fromNums[0], 10);
    const fromMinute = parseInt(fromNums[1], 10);
    const to = words[4];
    const toNums = to.split(':');
    const toHour = parseInt(toNums[0], 10);
    const toMinute = parseInt(toNums[1], 10);

    result.push({
      day,
      fromHour,
      fromMinute,
      toHour,
      toMinute,
    });
  });
  return result;
};

const processGroups = (groups) => {
  const doneGroups = [];

  Object.keys(groups).forEach((groupName) => {
    const subjects = groups[groupName];
    const doneSubjects = [];

    subjects.forEach((subject) => {
      doneSubjects.push(`${subject}-${groupName.replace(/\D/g, '')}`);
    });

    doneGroups.push({
      name: groupName,
      subjects: doneSubjects,
    });
  });
  return doneGroups;
};

const isSubjInArr = (arr, subjCode) => {
  let result = false;
  arr.forEach((el) => {
    if (el.code === subjCode) {
      result = true;
    }
  });

  return result;
};

const processSubjects = (groups) => {
  const doneSubjects = [];

  Object.keys(groups).forEach((groupName) => {
    const subjects = groups[groupName];
    subjects.forEach((subject) => {
      const subjCode = `${subject}-${groupName.replace(/\D/g, '')}`;
      if (isSubjInArr(doneSubjects, subjCode) === false) {
        doneSubjects.push({
          name: subject,
          code: subjCode,
        });
      }
    });
  });

  return doneSubjects;
};

export const addGroup = groupName => ({
  type: types.ADD_GROUP,
  groupName,
});

export const finishWizard = (timeslots, subjects, groups) => async (dispatch) => {
  const doneTimeslots = processTimeslots(timeslots);
  const doneGroups = processGroups(groups);
  // we need the subjects inside the groups, because the subject code includes the group name
  const doneSubjects = processSubjects(groups);

  const res = await makeRequest({
    url: `${ENDPOINT}/api/school/settings/base`,
    method: 'post',
    data: {
      timeslots: doneTimeslots,
      groups: doneGroups,
      subjects: doneSubjects,
    },
    dispatch,
  });

  if (res.success === true) {
    dispatch({ type: CHECK_SETUP_SUCCESS, setupFinished: true });
  }
};
