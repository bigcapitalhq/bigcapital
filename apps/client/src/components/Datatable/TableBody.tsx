// @ts-nocheck


export default function TableBody({}) {
  return (
    <ScrollSyncPane>
      <div {...getTableBodyProps()} className="tbody">
        <div class="tbody-inner" style={{ minWidth: totalColumnsWidth }}></div>
      </div>
    </ScrollSyncPane>
  );
}
