import { Button } from 'antd';
import { useState } from 'react';
import CherryEditor from '../../components/CherryEditor';

const markdownTemplate = `# Title
## Heading 2
Paragraph here
### Heading 3
If you know, you know ;)`;

function Create() {
  const [inputValue, setInputValue] = useState(markdownTemplate);

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
    <Button key="cancel" type="default" size="large" danger onClick={handleCancel}>Cancel</Button>,
    <Button key="draft" type="default" size="large" onClick={handleSaveAsDraft}>Save as Draft</Button>,
    <Button key="post" type="primary" size="large" onClick={handlePost}>Post</Button>
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
