// @ts-nocheck


export default function TableBody({}) {
  return (
    <ScrollSyncPane>
      <div {...getTableBodyProps()} className="tbody">
        <div className="tbody-inner" style={{ minWidth: totalColumnsWidth }}></div>
      </div>
    </ScrollSyncPane>
  );
}
