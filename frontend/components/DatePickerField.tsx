import React from "react";
import { Platform, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { theme } from "../utils/theme";
import { createPortal } from "react-dom";

interface DatePickerFieldProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
}

export const DatePickerField: React.FC<DatePickerFieldProps> = ({ label, value, onChange }) => {
  const [show, setShow] = React.useState(false);
  const [date, setDate] = React.useState<Date | null>(value ? new Date(value) : null);

  const handleChange = (selectedDate: Date | null) => {
    setShow(false);
    if (selectedDate) {
      setDate(selectedDate);
      // Persist in YYYY-MM-DD
      const iso = selectedDate.toISOString().slice(0, 10);
      onChange(iso);
    }
  };

  // Custom popper container para garantir z-index alto
  const popperContainer = ({ children }: { children?: React.ReactNode }) => {
    return typeof window !== "undefined" && children
      ? createPortal(children, document.body)
      : null;
  };

  // Exibe DD/MM/YYYY
  const displayValue = date ? `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}` : "";

  if (Platform.OS === "web") {
    React.useEffect(() => {
      const styleId = "custom-datepicker-popper-style";
      if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.innerHTML = `.custom-datepicker-popper { z-index: 9999 !important; }`;
        document.head.appendChild(style);
      }
    }, []);

    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>{label}</Text>
        <DatePicker
          selected={date}
          onChange={handleChange}
          dateFormat="dd/MM/yyyy"
          placeholderText="Selecione a data"
          className="react-datepicker__input"
          locale="pt-BR"
          popperContainer={popperContainer as any}
          popperClassName="custom-datepicker-popper"
        />
      </View>
    );
  }

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity onPress={() => setShow(true)} style={styles.input}>
        <Text>{displayValue || "Selecione a data"}</Text>
      </TouchableOpacity>
      {show && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display="default"
          onChange={(_event, selectedDate) => handleChange(selectedDate || date)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: theme.spacing.medium,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.light, // corrigido de gray para light
    borderRadius: theme.spacing.small,
    padding: theme.spacing.small,
    backgroundColor: theme.colors.white,
  },
});
