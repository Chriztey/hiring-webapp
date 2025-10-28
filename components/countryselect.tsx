import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

type CountryProps = {
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error?: string;
};

export default function CountrySelect({
  value,
  onChange,
  onBlur,
  error,
}: CountryProps) {
  //   const [phone, setPhone] = useState("");

  const border = error
    ? "border-danger-main focus:border-danger-main"
    : "border-neutral-60 focus:border-primary-border";

  return (
    <div className="mb-4">
      <PhoneInput
        country={"id"} // default Indonesia
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        inputProps={{
          name: "phone",
          required: true,
          autoFocus: false,
        }}
        inputStyle={{
          width: "100%",
          height: "30px",
          border: "2px solid #ccc",
          borderRadius: "6px",
        }}
        buttonStyle={{
          border: "2px solid #ccc",
          borderRight: "none",
          borderRadius: "6px 0 0 6px",
        }}
        dropdownStyle={{
          maxHeight: "200px",
          zIndex: 10000, // prevent clipping
        }}
      />

      {error && <p className="mt-1 text-s-regular text-danger-main">{error}</p>}
    </div>
  );
}
