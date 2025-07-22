// src/components/InputList.jsx
import React from 'react';
import InputText from './Input/InputText';
import InputFile from './Input/InputFile';
import SelectBox from './Input/SelectBox';
import CheckBox from './Input/CheckBox';
import TextAreaInput from './Input/TextAreaInput';
import ToogleInput from './Input/ToogleInput';
import Divider from './Input/Divider';

export const InputList = ({ infoItems, updateFormValue, fieldValues, shouldValidate }) => {
  const isVisible = (field) => {
    if (!(field.visible_on || field.not_visible_on)) return true;
    if (field.visible_on) return fieldValues[field.visible_on];
    if (field.not_visible_on) return !fieldValues[field.not_visible_on];
  };

  const isEnabled = (field) => {
    if (!(field.enable_on || field.not_enable_on)) return true;
    if (field.enable_on) return fieldValues[field.enable_on];
    if (field.not_enable_on) return !fieldValues[field.not_enable_on];
  };

  const hasError = (field) => {
    return shouldValidate && field.isRequired && !fieldValues[field.name]?.toString().trim();
  };

  return (
    <>
      {infoItems.map((field, idx) => {
        if (!isVisible(field)) return null;

        const isFieldEnabled = isEnabled(field);

        return (
          <div key={idx}>
            {field.type === "input" && (
              <InputText
                inputType={field.inputType}
                labelTitle={field.labelTitle}
                labelStyle={field.labelStyle}
                containerStyle={field.containerStyle}
                placeholder={field.placeholder}
                value={fieldValues[field.name] || ''}
                updateType={field.name}
                updateFormValue={(newValue) =>
                  updateFormValue(field.name, newValue)
                }
                labelPosition={field.position}
                size={field.size}
                border={field.border}
                disabled={!isFieldEnabled}
                hasError={hasError(field)}
              />
            )}
            {field.type === "file" && (
              <InputFile
                inputType={field.inputType}
                labelTitle={field.labelTitle}
                value={fieldValues[field.name] || ''}
                updateType={field.name}
                updateFormValue={(newValue) =>
                  updateFormValue(field.name, newValue)
                }
                labelPosition={field.position}
                size={field.size}
                border={field.border}
                disabled={!isFieldEnabled}
                hasError={hasError(field)}
              />
            )}
            {field.type === "select" && (
              <SelectBox
                labelTitle={field.labelTitle}
                labelStyle={field.labelStyle}
                containerStyle={field.containerStyle}
                placeholder={field.placeholder}
                value={fieldValues[field.name] || ''}
                options={field.options}
                updateType={field.name}
                updateFormValue={(type, value) => updateFormValue(type, value)}
                labelPosition={field.position}
                size={field.size}
                border={field.border}
                disabled={!isEnabled(field)}
                hasError={hasError(field)}
              />
            )}

            {field.type === "toggle" && (
              <ToogleInput
                labelTitle={field.labelTitle}
                placeholder={field.placeholder}
                value={fieldValues[field.name] || ''}
                updateType={field.name}
                updateFormValue={(data) =>
                  updateFormValue(data.updateType, data.value)
                }
                labelPosition={field.position}
                size={field.size}
                hasError={hasError(field)}
              />
            )}
            {field.type === "checkbox" && (
              <CheckBox
                labelTitle={field.labelTitle}
                value={fieldValues[field.name] || ''}
                updateType={field.name}
                updateFormValue={(data) =>
                  updateFormValue(data.updateType, data.value)
                }
                labelPosition={field.position}
                size={field.size}
                hasError={hasError(field)}
              />
            )}
            {field.type === "textinputarea" && (
              <TextAreaInput
                labelTitle={field.labelTitle}
                value={fieldValues[field.name] || ''}
                placeholder={field.placeholder}
                updateType={field.name}
                updateFormValue={(data) =>
                  updateFormValue(data.updateType, data.value)
                }
                labelPosition={field.position}
                size={field.size}
                border={field.border}
                disabled={!isFieldEnabled}
                hasError={hasError(field)}
              />
            )}
            {field.type === "divider" && (
              <Divider
                type={field.dividerType}
                text={field.text}
                containerStyle={field.containerStyle}
              />
            )}
            {field.type === "datatable" && (
              <DataTable
                data={field.data}
                columns={field.columns}
              />
            )}
          </div>
        );
      })}
    </>
  );
};
