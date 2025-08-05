import { Button, Drawer, Input, Label, Select } from "@medusajs/ui";
import { useState } from "react";
import { useCreateAdsPricing } from "../../../hooks/api/ads-promotion";

type Props = {
  open: boolean;
  close: () => void;
};

export const CreateAdsPricingForm = ({ open, close }: Props) => {
  const [type, setType] = useState<'product' | 'store'>('product');
  const [durationDays, setDurationDays] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');

  const { mutateAsync: createPricing } = useCreateAdsPricing({
    onSuccess: () => {
      close();
      // Reset form
      setType('product');
      setDurationDays('');
      setPricePerDay('');
    }
  });

  const handleSubmit = () => {
    createPricing({
      type,
      duration_days: parseInt(durationDays),
      price_per_day: parseFloat(pricePerDay) * 100 // Convert to kobo
    });
  };

  return (
    <Drawer open={open} onOpenChange={close}>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Create Ads Pricing</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="p-6">
          <div className="space-y-4">
            <div>
              <Label>Ad Type</Label>
              <Select value={type} onValueChange={()=>setType}>
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="product">Product Ad</Select.Item>
                  <Select.Item value="store">Store Ad</Select.Item>
                </Select.Content>
              </Select>
            </div>
            
            <div>
              <Label>Duration (Days)</Label>
              <Input
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                placeholder="e.g., 7, 14, 30"
              />
            </div>
            
            <div>
              <Label>Price per Day (₦)</Label>
              <Input
                type="number"
                step="0.01"
                value={pricePerDay}
                onChange={(e) => setPricePerDay(e.target.value)}
                placeholder="e.g., 1000"
              />
            </div>
          </div>
        </Drawer.Body>
        <Drawer.Footer>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Create Pricing
            </Button>
          </div>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
};