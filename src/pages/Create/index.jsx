import { Button } from 'antd';
import { useState } from 'react';
import CherryEditor from '../../components/CherryEditor';

function Create() {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (text) => {
    setInputValue(text);
  };

  const handlePost = () => {
    // TODO: implement handlePost
    console.log(inputValue);
  };

  const handleSaveAsDraft = () => {
    // TODO: implement handleSaveAsDraft
  };

  const handleCancel = () => {
    // TODO: implement handleCancel
  };

  const buttons = [
    <Button type="default" size="large" danger onClick={handleCancel}>Cancel</Button>,
    <Button type="default" size="large" onClick={handleSaveAsDraft}>Save as Draft</Button>,
    <Button type="primary" size="large" onClick={handlePost}>Post</Button>
  ];

  return (
    <CherryEditor
      value={inputValue}
      onChange={handleInputChange}
      buttons={buttons}
      buttonGap="small"
    />
  );
}

export default Create;
