import * as yup from 'yup';

export default (value) => {
  const schema = yup.string()
    .required();
  try {
    schema.validateSync(value);
    return null;
  } catch (err) {
    return err.errors[0];
  }
};
