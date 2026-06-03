import type { ProgressPhoto } from '../types';

type Props = {
  leftLabel: string;
  rightLabel: string;
  leftPhoto?: ProgressPhoto | null;
  rightPhoto?: ProgressPhoto | null;
};

function PhotoSlot({ label, photo }: { label: string; photo?: ProgressPhoto | null }) {
  return (
    <div>
      <div style={box}>
        {photo?.url ? (
          <img src={photo.url} alt={`${label} ${photo.angle}`} style={image} />
        ) : (
          <span>Foto</span>
        )}
      </div>
      <p style={labelStyle}>{label}</p>
      {photo?.notes && <p style={notes}>{photo.notes}</p>}
    </div>
  );
}

export default function PhotoComparison({
  leftLabel,
  rightLabel,
  leftPhoto,
  rightPhoto
}: Props) {
  return (
    <div style={panel}>
      <div style={grid}>
        <PhotoSlot label={leftLabel} photo={leftPhoto} />
        <PhotoSlot label={rightLabel} photo={rightPhoto} />
      </div>
    </div>
  );
}

const panel = {
  background: '#101010',
  border: '1px solid #262626',
  borderRadius: 22,
  padding: 24
};

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
  gap: 18
};

const box = {
  height: 280,
  borderRadius: 20,
  border: '1px dashed #e01616',
  background: '#090909',
  display: 'grid',
  placeItems: 'center',
  color: '#666',
  overflow: 'hidden'
};

const image = {
  width: '100%',
  height: '100%',
  objectFit: 'cover' as const
};

const labelStyle = {
  color: '#d8d8d8',
  marginTop: 12,
  textAlign: 'center' as const
};

const notes = {
  color: '#a0a0a0',
  marginTop: 6,
  textAlign: 'center' as const
};
