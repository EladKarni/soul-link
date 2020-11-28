import firebase from '../Config/Firebase';

const DoesListExist = (code) => {
  const doeslistExistCloudFunc = firebase.functions().httpsCallable('doesListExist');
  return doeslistExistCloudFunc(`${code}`).then((result) => {
    if (result.data) {
      return true;
    }
    return false;
  });
};

export default DoesListExist;
