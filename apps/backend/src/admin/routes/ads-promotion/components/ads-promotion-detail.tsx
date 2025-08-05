import { Button, Drawer, Text, Textarea, Select } from "@medusajs/ui";
import { useState } from "react";
import { formatDate } from "../../../lib/date";

type Props = {
  ad?: any;
  open: boolean;
  close: () => void;
  onReview: (data: any) => void;
};

export const AdsPromotionDetail = ({ ad, open, close, onReview }: Props) => {
  const [status, setStatus] = useState<'active' | 'rejected'>('active');
  const [note, setNote] = useState('');

  const handleReview = () => {
    onReview({
      id: ad.id,
      payload: {
        status,
        admin_reviewer_note: note
      }
    });
  };

  if (!ad) return null;

  return (
    <Drawer open={open} onOpenChange={close}>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>Review Ad Promotion</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body className="p-6">
          <div className="space-y-4">
            <div>
              <Text className="font-medium">Title:</Text>
              <Text>{ad.title}</Text>
            </div>
            
            <div>
              <Text className="font-medium">Description:</Text>
              <Text>{ad.description || 'No description'}</Text>
            </div>
            
            <div>
              <Text className="font-medium">Seller:</Text>
              <Text>{ad.seller_id} {ad.seller?.email}</Text>
            </div>
            
            <div>
              <Text className="font-medium">Type:</Text>
              <Text className="capitalize">{ad.type}</Text>
            </div>
            
            <div>
              <Text className="font-medium">Budget:</Text>
              <Text>₦{ad.budget_amount.toLocaleString()}</Text>
            </div>
            
            <div>
              <Text className="font-medium">Created:</Text>
              <Text>{formatDate(ad.created_at)}</Text>
            </div>

            {ad.status === 'pending_payment' && (
              <>
                <div>
                  <Text className="font-medium mb-2">Review Decision:</Text>
                  <Select value={status} onValueChange={()=> setStatus}>
                    <Select.Trigger>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="active">Approve</Select.Item>
                      <Select.Item value="rejected">Reject</Select.Item>
                    </Select.Content>
                  </Select>
                </div>
                
                <div>
                  <Text className="font-medium mb-2">Review Note:</Text>
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note about your decision..."
                  />
                </div>
              </>
            )}
          </div>
        </Drawer.Body>
        <Drawer.Footer>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
            {ad.status === 'pending_payment' && (
              <Button onClick={handleReview}>
                Submit Review
              </Button>
            )}
          </div>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
};