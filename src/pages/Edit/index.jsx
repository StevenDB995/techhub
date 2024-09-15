import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CherryEditor from '../../components/CherryEditor';
import Loading from '../../components/CherryEditor/Loading';
import blogsData from '../../mockData/blogs';

function Edit() {
  const { blogId } = useParams();
  // the blog data fetched
  const [blog, setBlog] = useState();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      const data = blogsData[blogId];
      setBlog(data);
      setInputValue(data.content);
    }, 750);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const handleInputChange = (text) => {
    setInputValue(text);
  };

  const handleSave = () => {
    // TODO: implement handleSave
    console.log(inputValue);
  };

  const buttons = [
    <Button key="cancel" type="default" size="large" danger>Cancel</Button>,
    <Button key="save" type="primary" size="large" onClick={handleSave}>Save</Button>
  ];

  return blog ? (
    <CherryEditor
      value={inputValue}
      onChange={handleInputChange}
      buttons={buttons}
      buttonGap="middle"
    />
  ) : <Loading />;
}

export default Edit;