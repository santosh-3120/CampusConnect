import { useContext } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import FileInput from '../components/common/FileInput';
import Button from '../components/common/Button';
import { SocketContext } from '../context/SocketContext.jsx';
const validationSchema = Yup.object({
  itemName: Yup.string().required('Item name is required'),
  description: Yup.string().required('Description is required'),
  location: Yup.string().required('Location is required'),
  status: Yup.string().oneOf(['lost', 'found']).required('Status is required'),
  date: Yup.date().required('Date is required').max(new Date(), 'Date cannot be in the future'),
  handoverTo: Yup.string().required('Handover person is required'),
  handoverLocation: Yup.string().required('Handover location is required'),
  image: Yup.mixed()
    .required('Image is required')
    .test('fileSize', 'File too large', (value) => value && value.size <= 5 * 1024 * 1024)
    .test('fileType', 'Unsupported file type', (value) =>
      value && ['image/jpeg', 'image/png'].includes(value.type)
    ),
});

function CreateLostFound() {
  const navigate = useNavigate();
  const socket = useContext(SocketContext);

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create Lost & Found Post</h1>
      <Formik
        initialValues={{
          itemName: '',
          description: '',
          location: '',
          status: 'lost',
          date: '',
          handoverTo: '',
          handoverLocation: '',
          image: null,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          // Mock API call
          // const formData = new FormData();
          // Object.keys(values).forEach((key) => formData.append(key, values[key]));
          // Axios.post('/api/lost-found', formData).then((res) => {
          const newPost = {
            _id: Date.now().toString(),
            ...values,
            image: '/assets/placeholder.jpg', // Mock image URL
            isClaimed: false,
          };
          socket.emit('newLostFoundPost', newPost);
          setSubmitting(false);
          navigate('/lost-and-found');
          // });
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-6 max-w-lg mx-auto">
            <div>
              <Field
                name="itemName"
                placeholder="Item Name (e.g., Wallet)"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="itemName" component="p" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <Field
                as="textarea"
                name="description"
                placeholder="Description"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="4"
              />
              <ErrorMessage name="description" component="p" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <Field
                name="location"
                placeholder="Location (e.g., Library)"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="location" component="p" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <Field
                as="select"
                name="status"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </Field>
              <ErrorMessage name="status" component="p" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <Field
                name="date"
                type="date"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="date" component="p" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <Field
                name="handoverTo"
                placeholder="Handover to (e.g., Prof. Smith)"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="handoverTo" component="p" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <Field
                name="handoverLocation"
                placeholder="Handover Location (e.g., Office Room 101)"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <ErrorMessage name="handoverLocation" component="p" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <FileInput name="image" />
              <ErrorMessage name="image" component="p" className="text-red-500 text-sm mt-1" />
            </div>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Submitting...' : 'Create Post'}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CreateLostFound;