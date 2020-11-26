import firebase from '../Config/Firebase';

const DoesListExist = (code) => {
  const doeslistExistCloudFunc = firebase.functions().httpsCallable('doesListExist');

  doeslistExistCloudFunc(`${code}`).then((result) => {
    if (!result.data) {
      setLoading(false);
      setErr('Please Check The Code');
    } else {
      setLoading(false);
      history.push(`/SL-${code}`);
    }
  });
};
