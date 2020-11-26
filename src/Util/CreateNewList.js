import firebase from '../Config/Firebase';

const createNewList = (setLoading, hsty) => {
  setLoading(true);
  const creatNewList = firebase.functions().httpsCallable('createNewList');
  creatNewList().then((result) => {
    setLoading(false);
    hsty.push(`/SL-${result.data}`);
  });
};

export default createNewList;
